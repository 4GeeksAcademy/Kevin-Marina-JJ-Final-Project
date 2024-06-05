import React from "react";
import { useNavigate } from "react-router-dom";
import ServicesLeft from "../../../img/services-left.png";
import ServicesRight from "../../../img/services-right.png";
import "../../../styles/Landing-styles/services.css";

const Services = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/services");
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });;
  };
  return (
    <article className="services">
      <h2 className="services-title"> Fitness & Bodybuilding <span className="green-text">Programs</span></h2>
      <div className="services-container">
        <div className="left-services">
          <img
            src={ServicesLeft}
            alt="basic fitnes section image"
            onClick={handleClick}
            className="services-img left-img" />
          <h4>
            Basic <span className="green-text">Fitness</span>
          </h4>
          <ul>
            <li>Stretching and flexibility</li>
            <li>Aerobic exercise</li>
            <li>Strength training</li>
            <li>Sports nutrition</li>
          </ul>

        </div>
        <div className="right-services">
          <img
            src={ServicesRight}
            alt="Body building section image"
            onClick={handleClick}
            className="services-img right-img" />
          <h4>
            Body <span className="green-text">Body</span>
          </h4>
          <ul>
            <li>Professional bodybuilding</li>
            <li>Classic physique</li>
            <li>Men's physique</li>
            <li>Women's physique</li>
          </ul>

        </div>

      </div>
      <button className="service-button" onClick={handleClick}>Learn More</button>
    </article>
  );
};

export default Services;
