import React from 'react'

import "../../../styles/Landing-styles/servicesPage.css";

import PersonalTrainingImg from '../../../img/personalTrainingImg.jpg';
import GroupFitnessImg from '../../../img/groupFitnessImg.jpg';
import NutritionCoachingImg from '../../../img/nutritionCoachImg.jpg';
import OnlineProgramsImg from '../../../img/onlineProgramsImg.jpg';



const Services = () => {
    return (
        <div className="services-page">
            <h1>Our <span className='green-text'>Services</span></h1>
            <p>Welcome to our comprehensive list of fitness and bodybuilding programs. We offer a variety of services to help you achieve your health and fitness goals.</p>

            <section className="service-section">
                <div className="service-content">
                    <img src={PersonalTrainingImg} alt="Personal Training" className="service-img" />
                    <div className="service-text">
                        <h2><span className='green-text'>Personal</span> Training</h2>
                        <p>Our certified personal trainers will work with you one-on-one to create a customized workout plan tailored to your specific needs and goals.</p>
                        <ul>
                            <li>Individualized training plans</li>
                            <li>Progress tracking</li>
                            <li>Motivation and support</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="service-section">
                <div className="service-content reverse">
                    <img src={GroupFitnessImg} alt="Group Fitness Classes" className="service-img" />
                    <div className="service-text">
                        <h2><span className='green-text'>Group</span> Fitness Classes</h2>
                        <p>Join our group fitness classes for a fun and motivating workout experience. We offer a variety of classes for all fitness levels.</p>
                        <ul>
                            <li>Yoga</li>
                            <li>Pilates</li>
                            <li>Zumba</li>
                            <li>HIIT</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="service-section">
                <div className="service-content">
                    <img src={NutritionCoachingImg} alt="Nutrition Coaching" className="service-img" />
                    <div className="service-text">
                        <h2><span className='green-text'>Nutrition</span> Coaching</h2>
                        <p>Our nutrition coaches will help you create a healthy eating plan that supports your fitness goals and overall well-being.</p>
                        <ul>
                            <li>Personalized meal plans</li>
                            <li>Dietary guidance</li>
                            <li>Supplement advice</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="service-section">
                <div className="service-content reverse">
                    <img src={OnlineProgramsImg} alt="Online Programs" className="service-img" />
                    <div className="service-text">
                        <h2><span className='green-text'>Online</span> Programs</h2>
                        <p>Access our fitness and nutrition programs from the comfort of your home. Our online programs are designed to be flexible and convenient.</p>
                        <ul>
                            <li>Virtual personal training</li>
                            <li>Online group classes</li>
                            <li>Nutrition webinars</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}


export default Services