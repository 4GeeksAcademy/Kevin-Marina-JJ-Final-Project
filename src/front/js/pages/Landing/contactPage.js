import React from 'react';
import { CiLinkedin } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import MarinaPhoto from '../../../img/Marina.jpeg';
import KevinPhoto from '../../../img/Kevin.jpeg';
import JoseJoaquinPhoto from '../../../img/JJ.jpeg';
import '../../../styles/Landing-styles/contactPage.css';

const ContactPage = () => {
    return (
        <div className="contact-page">
            <h1>Contact <span className='green-text'>MKJ</span></h1>
            <p>Get in touch with our team through <span className='green-text'>LinkedIn</span> and <span className='green-text'>GitHub</span>.</p>
            <div className='contact-container'>
                <section className="contact-section">
                    <div className="contact-content">
                        <img src={MarinaPhoto} alt="Marina" className="contact-img" />
                        <div className="contact-text">
                            <h2>Marina</h2>
                            <div className="contact-links">
                                <a href="https://github.com/Marinamb19" target="_blank" rel="noopener noreferrer" className="contact-link">
                                    <FaGithub className="icon" />
                                    <span>GitHub</span>
                                </a>
                                <a href="https://www.linkedin.com/in/marina-martín-barranco-7a6316247" target="_blank" rel="noopener noreferrer" className="contact-link">
                                    <CiLinkedin className="icon" />
                                    <span>LinkedIn</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="contact-section">
                    <div className="contact-content">
                        <img src={KevinPhoto} alt="Kevin" className="contact-img" />
                        <div className="contact-text">
                            <h2>Kevin</h2>
                            <div className="contact-links">
                                <a href="https://github.com/KevinGaBo" target="_blank" rel="noopener noreferrer" className="contact-link">
                                    <FaGithub className="icon" />
                                    <span>GitHub</span>
                                </a>
                                <a href="https://www.linkedin.com/in/kevin-boriosi-61261126b/" target="_blank" rel="noopener noreferrer" className="contact-link">
                                    <CiLinkedin className="icon" />
                                    <span>LinkedIn</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="contact-section">
                    <div className="contact-content">
                        <img src={JoseJoaquinPhoto} alt="Jose Joaquin" className="contact-img" />
                        <div className="contact-text">
                            <h2>Jose Joaquin</h2>
                            <div className="contact-links">
                                <a href="https://github.com/JoseJoaquinMartinez" target="_blank" rel="noopener noreferrer" className="contact-link">
                                    <FaGithub className="icon" />
                                    <span>GitHub</span>
                                </a>
                                <a href="https://www.linkedin.com/in/josé-joaquín-martínez-carrillo-66621a173" target="_blank" rel="noopener noreferrer" className="contact-link">
                                    <CiLinkedin className="icon" />
                                    <span>LinkedIn</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </div>
    );
};

export default ContactPage;