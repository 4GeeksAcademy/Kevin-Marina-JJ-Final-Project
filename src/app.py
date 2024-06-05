import os
from flask import Flask, request, jsonify, url_for, send_from_directory, abort, Response
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, Trainer, Trainer_data, User, User_data, Routines, Exercise, Image
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from datetime import timedelta
from flask_cors import CORS
from werkzeug.utils import secure_filename
import base64
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
from dotenv import load_dotenv

load_dotenv()

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False
app.config['JWT_SECRET_KEY'] = 'your_secret_key_here'
jwt = JWTManager(app)

# database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
    
CORS(app)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS').lower() in ['true', '1', 'yes']
app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL').lower() in ['true', '1', 'yes']
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
app.config['SECRET_KEY'] = os.getenv('MAIL_SECRET_KEY')

mail = Mail(app)
# add the admin
setup_admin(app)
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory

    return response

# Login & Signup Endpoints
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data:
        raise APIException('Insert the correct information', status_code=400)
    
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        raise APIException('Missing email or password', status_code=400)
    
    user = User.query.filter_by(email=email).first()
    trainer = Trainer.query.filter_by(email=email).first()
    
    if (user and password != user.password) or (trainer and password != trainer.password):
        raise APIException('Invalid password, please try again', status_code=401)
    
    if user:
        role = "user"
        identity = user.id  
    elif trainer:
        role = "trainer"
        identity = trainer.id  
    else:
        raise APIException('User not found', status_code=404)
    
   
    access_token = create_access_token(identity=identity, additional_claims={"role": role})
    

    return jsonify({ "access_token": access_token}), 200

@app.route('/signup', methods=['POST'])
def create_new_user():
    data = request.json
    check_if_email_already_exists = User.query.filter_by(email=data["email"]).first()
    if check_if_email_already_exists:
        raise APIException('Email already exists', status_code=400)
        
    
    new_user = User( 
        email=data["email"],
        password=data["password"],
        role="user",
    )

    db.session.add(new_user)
    db.session.commit()

    new_user_id = new_user.id

    access_token = create_access_token(identity=new_user_id, additional_claims={"role": new_user.role})

    return jsonify({'access_token': access_token}), 200
# Delete user
@app.route('/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        raise APIException('User not found', status_code=404)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': f'User {user_id} and all associated data deleted'}), 200

#User Endpoints
@app.route('/user_data/<int:user_id>')
@jwt_required()
def get_user_data(user_id):
    user = User.query.get(user_id)
    
    if user:
        user_data = User_data.query.filter_by(user_id=user_id).first()
        serialized_user_data = user_data.serialize()

        return jsonify(serialized_user_data), 200
    else:
        raise APIException('User data not found', status_code=404)
        

@app.route('/user_data/<int:id>', methods=['POST', 'PATCH'])
@jwt_required()
def add_or_update_user_data(id):
    data = request.json
    existing_user_data = User_data.query.filter_by(user_id=id).first()
    if existing_user_data:
        existing_user_data.user_name = data.get("user_name", existing_user_data.user_name)
        existing_user_data.user_weight = data.get("user_weight", existing_user_data.user_weight)
        existing_user_data.user_height = data.get("user_height", existing_user_data.user_height)
        existing_user_data.user_illness = data.get("user_illness", existing_user_data.user_illness)
        existing_user_data.user_objetives = data.get("user_objetives", existing_user_data.user_objetives)
        existing_user_data.user_age = data.get("user_age", existing_user_data.user_age)
        db.session.commit()
        
        updated_user_data = User_data.query.filter_by(user_id=id).first()
        serialized_user_data = updated_user_data.serialize()

        return jsonify(serialized_user_data), 200
    else:
       
        new_user_data = User_data(
            user_name=data.get("user_name"),
            user_weight=data.get("user_weight"),
            user_height=data.get("user_height"),
            user_illness=data.get("user_illness"),
            user_objetives=data.get("user_objetives"),
            user_age=data.get("user_age"),
            user_id=get_jwt_identity() ,
            trainer_data_id=1,
        )

        db.session.add(new_user_data)
        db.session.commit()

        serialized_new_user_data = new_user_data.serialize()

        return jsonify(serialized_new_user_data), 200
    
    
@app.route('/user/<int:user_id>/profile_picture', methods=['POST', 'PUT'])
@jwt_required()
def upload_user_profile_picture(user_id):
    user_data = User_data.query.filter_by(user_id=user_id).first()
    if not user_data:
        raise APIException('User not found', status_code=404)

    imagen = request.files.get('user_profile_picture')
    if not imagen:
        raise APIException('No image selected', status_code=400)

    filename = secure_filename(imagen.filename)
    mimetype = imagen.mimetype
    img_bytes = imagen.read()
    img_base64 = base64.b64encode(img_bytes).decode('utf-8')

    if request.method == 'POST':
        
        existing_image = Image.query.filter_by(user_data_id=user_data.id).first()
        if existing_image:
            return jsonify({'error': 'Image already exists, use PUT to update'}), 400

        new_image = Image(
            user_data_id=get_jwt_identity(),
            img=img_bytes,
            name=filename,
            mimetype=mimetype,
        )
        db.session.add(new_image)
        db.session.commit()

        serialized_image = {
            'id': new_image.id,
            'user_data_id': new_image.user_data_id,
            'name': new_image.name,
            'mimetype': new_image.mimetype,
            'img': img_base64
        }
        return jsonify(serialized_image), 200

    elif request.method == 'PUT':
        existing_image = Image.query.filter_by(user_data_id=get_jwt_identity()).first()
        if not existing_image:
            return jsonify({'error': 'Image not found, use POST to create'}), 404

        existing_image.img = img_bytes
        existing_image.name = filename
        existing_image.mimetype = mimetype
        db.session.commit()

        serialized_image = {
            'id': existing_image.id,
            'user_data_id': get_jwt_identity(),
            'name': existing_image.name,
            'mimetype': existing_image.mimetype,
            'img': img_base64
        }
        return jsonify(serialized_image), 200

    return jsonify({'error': 'Invalid method'}), 405


# Get user profile picture
@app.route('/user/<int:user_id>/profile_picture', methods=['GET'])
@jwt_required()
def get_user_profile_picture(user_id):
    user_profile_image = Image.query.filter_by(user_data_id=user_id).first()
    if not user_profile_image:
        raise APIException('User profile image not found', status_code=404)

    image_data = {
        'id': user_profile_image.id,
        'img': base64.b64encode(user_profile_image.img).decode('utf-8'),
        'name': user_profile_image.name,
        'mimetype': user_profile_image.mimetype
    }
    return jsonify(image_data), 200

# Trainer Endpoints
@app.route('/trainer', methods=['POST'])
def create_new_trainer():
    data = request.json
    check_if_email_already_exists = Trainer.query.filter_by(email=data["email"]).first()
    if check_if_email_already_exists:
        raise APIException('Email already exists', status_code=400)
    
    new_trainer = Trainer( 
        email=data["email"],
        password=data["password"],
        role="trainer",
    )

    db.session.add(new_trainer)
    db.session.commit()

    new_trainer_id = new_trainer.id

    access_token = create_access_token(identity=new_trainer_id, additional_claims={"role": new_trainer.role})

    return jsonify({'access_token': access_token}), 200

@app.route('/trainer/<int:id>', methods=['POST'])
@jwt_required()
def post_trainer_data(id):
    data = request.json

    new_trainer_data = Trainer_data(
        trainer_name=data.get("trainer_name"),
        profile_picture= "",
        trainer_id=id,  
    )

    db.session.add(new_trainer_data)
    db.session.commit()

    serialized_new_trainer_data = new_trainer_data.serialize()

    return jsonify(serialized_new_trainer_data), 200



@app.route('/trainer/<int:id>')
@jwt_required()
def get_trainer_users(id):
    trainer = Trainer_data.query.filter_by(trainer_data_id=id).first()
    if not trainer:
        raise APIException('User not found', status_code=404)
       
    
    users = User_data.query.filter_by(trainer_data_id=id)
    serialized_users = [user.serialize() for user in users]
    
    return jsonify(serialized_users), 200
    
@app.route('/trainer/<int:trainer_id>/<int:user_id>')
@jwt_required()
def get_single_user_from_trainer(trainer_id, user_id):
    user = User_data.query.filter_by(trainer_id=trainer_id, user_id=user_id).first()

    if not user:
        raise APIException('Not users associated with this account', status_code=400)
        
    serialized_user = user.serialize()

    return jsonify(serialized_user), 200

# Routines endpoints
#Get users actual rutine
@app.route('/user/<int:user_id>/actual_routine')
@jwt_required()
def get_actual_routine(user_id):
    user_routine = Routines.query.filter_by(user_data_id=user_id).first()
    if user_routine:
        app.logger.info(f'User routine found for user_id: {user_id}')
        return jsonify(user_routine.serialize())
    else:
        app.logger.warning(f'No user routine found for user_id: {user_id}')
        raise APIException('No user routine found', status_code=404)
        

#Get the particular user's Historical 
@app.route('/user/<int:user_id>/routine_history')
@jwt_required()
def get_routine_history(user_id):

    user_routine = Routines.query.filter_by(user_data_id=user_id).first()

    if user_routine:
        user_history = user_routine.historical
        return jsonify({"historical": user_history})
    else:
        raise APIException("User's historical not found", status_code=404)
       
    
#Allows the Trainer to set the rutine to the user
@app.route('/trainer/<int:user_id>/set_routine', methods=['POST'])
@jwt_required()
def set_routine_with_exercises(user_id):
    data = request.json
    
    user = User.query.get(user_id)
    if not user:
        raise APIException('User not found', status_code=404)
        
    user_data = User_data.query.filter_by(user_id=user.id).first()
    if not user_data:
        raise APIException('User data not found', status_code=404)

    routine_data = data.get("routine")
    if not routine_data:
        raise APIException('Routine data missing', status_code=400)

    user_routine = Routines.query.filter_by(user_data_id=user_data.id).first()
    if not user_routine:
        new_routine = Routines(
            user_data_id=user_data.id,
            trainer_data_id=data["trainer_data_id"],
            actual_routine=routine_data,
            historical=[routine_data]
        )
        db.session.add(new_routine)
    else:
        user_routine.actual_routine = routine_data
        user_routine.historical.append(routine_data)

    db.session.commit()

    return jsonify({'message': 'Routine added with exercises'}), 201


# Exercise Endpoints
# Get all exercises
@app.route('/exercises', methods=['GET'])
@jwt_required()
def get_all_exercises():
    exercises = Exercise.query.all()
    serialized_exercises = [exercise.serialize() for exercise in exercises]
    return jsonify(serialized_exercises), 200

# Get exercise by ID
@app.route('/exercises/<int:exercise_id>', methods=['GET'])
@jwt_required()
def get_exercise(exercise_id):

    exercise = Exercise.query.get(exercise_id)

    if not exercise:
        raise APIException('Exercise not found', status_code=404)
        

    serialized_exercise = exercise.serialize()

    return jsonify(serialized_exercise), 200

# Create a new exercise
@app.route('/exercises', methods=['POST'])
@jwt_required()
def create_exercise():
    data = request.json

    new_exercise = Exercise(
        exercise_name=data["exercise_name"],
        exercise_type=data["exercise_type"],
        exercise_weight=data.get("exercise_weight"),
        user_data_id=data.get("user_data_id"),
        trainer_data_id=data.get("trainer_data_id")
    )

    db.session.add(new_exercise)
    db.session.commit()

    serialized_new_exercise = new_exercise.serialize()
    return jsonify(serialized_new_exercise), 201

# Update an existing exercise
@app.route('/exercises/<int:exercise_id>', methods=['PATCH'])
@jwt_required()
def update_exercise(exercise_id):
    data = request.json

    exercise = Exercise.query.get(exercise_id)

    if not exercise:
        raise APIException('Exercise not found', status_code=404)
        
    
    exercise.exercise_name = data.get("exercise_name", exercise.exercise_name)
    exercise.exercise_type = data.get("exercise_type", exercise.exercise_type)
    exercise.exercise_weight = data.get("exercise_weight", exercise.exercise_weight)
    exercise.user_data_id = data.get("user_data_id", exercise.user_data_id)
    exercise.trainer_data_id = data.get("trainer_data_id", exercise.trainer_data_id)

    db.session.commit()

    serialized_updated_exercise = exercise.serialize()

    return jsonify(serialized_updated_exercise), 200

# Delete an exercise
@app.route('/exercises/<int:exercise_id>', methods=['DELETE'])
@jwt_required()
def delete_exercise(exercise_id):
    exercise = Exercise.query.get(exercise_id)

    if not exercise:
        raise APIException('Exercise not found', status_code=404)
        
    
    db.session.delete(exercise)
    db.session.commit()
    
    return jsonify({'message': 'Exercise deleted'}), 200


#Forgot Password endpoint
def generate_password_reset_token(email):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    return serializer.dumps(email, salt='password-reset-salt')

def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        email = serializer.loads(
            token,
            salt='password-reset-salt',
            max_age=expiration
        )
    except:
        return False
    return email

@app.route('/reset_password', methods=['POST'])
def reset_password_request():
    data = request.json
    email = data.get('email')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Email not found"}), 404

    token = generate_password_reset_token(email)
    reset_url = url_for('reset_password', token=token, _external=True)

    msg = Message(
        'Password Reset Request',
        recipients=[email],
        body=f'Your password reset link is: {reset_url}',
        sender=app.config['MAIL_DEFAULT_SENDER'] 
    )
    mail.send(msg)

    return jsonify({"message": "Password reset email has been sent."}), 200

@app.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    try:
        email = confirm_token(token)
    except:
        return jsonify({"message": "Invalid or expired token"}), 400

    if request.method == 'POST':
        data = request.json
        new_password = data.get('password')

        user = User.query.filter_by(email=email).first()
        if user:
            user.password = new_password
            db.session.commit()
            return jsonify({"message": "Password has been reset successfully"}), 200
        return jsonify({"message": "User not found"}), 404

    return jsonify({"message": "Provide a new password"}), 200


if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)