from sqlalchemy import Column, ForeignKey, Integer, String, JSON
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Trainer(db.Model):
    id = Column(Integer, primary_key=True)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(80), nullable=False)
    role = Column(String(10), nullable=False)
    trainer_data = relationship("Trainer_data", backref="trainer", lazy=True)
    
    def __repr__(self):
        return f'<Trainer {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
        }

class Trainer_data(db.Model):
    trainer_data_id = Column(Integer, primary_key=True)
    trainer_id = Column(Integer, ForeignKey(Trainer.id))
    trainer_name = Column(String(50), nullable=False)
    profile_picture = Column(String(250), nullable=True)
    users = relationship("User_data", backref="trainer_data", lazy=True)
    exercises = relationship("Exercise", backref="trainer_data", lazy=True)
    
    def __repr__(self):
        return f'<Trainer_data {self.trainer_name}>'

    def serialize(self):
        return {
            "trainer_data_id": self.trainer_data_id,
            "trainer_name": self.trainer_name,
            "profile_picture": self.profile_picture
        }

class User(db.Model):
    id = Column(Integer, primary_key=True)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(80), nullable=False)
    role = Column(String(10), nullable=False)
    user_data = relationship("User_data", backref="user",cascade="all,delete-orphan", lazy=True)
    
    def __repr__(self):
        return f'<User {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
        }

class User_data(db.Model):
    id = Column(Integer, primary_key=True)
    user_name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey(User.id))
    user_weight = Column(Integer, nullable=True)
    user_height = Column(Integer, nullable=True)
    user_illness = Column(String(250), nullable=False)
    user_objetives = Column(String(250), nullable=True)
    trainer_data_id = Column(Integer, ForeignKey(Trainer_data.trainer_data_id))
    exercises = relationship("Exercise", backref="user_data",cascade="all,delete-orphan", lazy=True)
    routines = relationship("Routines", backref="user_data",cascade="all,delete-orphan", lazy=True)
    
    def __repr__(self):
        return f'<User_data {self.user_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "user_id": self.user_id,
            "user_weight": self.user_weight,
            "user_height": self.user_height,
            "user_illness": self.user_illness,
            "user_objetives": self.user_objetives,
            "trainer_data_id": self.trainer_data_id
        }

class Routines(db.Model):
    id = Column(Integer, primary_key=True)
    actual_routine = Column(JSON, nullable=False)
    historical = Column(JSON, nullable=True)
    user_data_id = Column(Integer, ForeignKey(User_data.id), unique=True, nullable=False)
    trainer_data_id = Column(Integer, ForeignKey(Trainer_data.trainer_data_id), nullable=False)
    
    def __repr__(self):
        return f'<Routines {self.id}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'actual_routine': self.actual_routine,
            'historical': self.historical,
        }

class Exercise(db.Model):
    id = Column(Integer, primary_key=True)
    exercise_name = Column(String(100), nullable=False, unique=True)
    exercise_type = Column(String(50), nullable=False)
    exercise_weight = Column(Integer, nullable=True)
    user_data_id = Column(Integer, ForeignKey(User_data.id))
    trainer_data_id = Column(Integer, ForeignKey(Trainer_data.trainer_data_id))
    
    def __repr__(self):
        return f'<Exercise {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "exercise_name": self.exercise_name,
            "exercise_type": self.exercise_type,
            "exercise_weight": self.exercise_weight,
        }

class RoutineExerciseAssociation(db.Model):
    id = Column(Integer, primary_key=True)
    routine_id = Column(Integer, ForeignKey(Routines.id))
    exercise_id = Column(Integer, ForeignKey(Exercise.id))

    def __repr__(self):
        return f'<RoutineExerciseAssociation {self.id}>'
