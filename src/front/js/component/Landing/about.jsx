import React from "react";
import "../../../styles/Landing-styles/about.css";
import AboutImage from "../../../img/about-img.png";

const About = () => {
  const isMobile = window.innerWidth < 768;

  return (
    <article>
      <h2 className="about-title">
        Why <span className="green-text">Fitness</span> is important?
      </h2>
      <div className="about-content">
        <img
          className="about-img"
          src={AboutImage}
          alt="woman streching about img"
        />
        <div className="about-text">

          {isMobile ? (
            <p className="about-parr">
              Welcome to MKJ, your gateway to a healthier lifestyle through
              physical activity. Discover the benefits of staying active with us.
            </p>
          ) : (
            <>
              <p className="about-parr">
                Welcome to MKJ, your gateway to a healthier lifestyle through
                physical activity. We're more than just a gym; we're your partner in
                achieving holistic well-being. At MKJ, we understand the profound
                impact of staying active on both body and mind. From enhancing brain
                health and managing weight to fortifying bones and muscles, the
                benefits of physical activity are undeniable.
              </p>
              <p>
                Our mission is to empower you to embrace an active lifestyle, no
                matter your fitness level. Whether you're a seasoned gym-goer or new
                to the fitness scene, our dedicated team is here to support and
                guide you on your journey towards better health. Join us at MKJ and
                experience the transformative power of movement.
              </p>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default About;