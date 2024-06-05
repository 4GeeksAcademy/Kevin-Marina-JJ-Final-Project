import React from "react";

import { PopupButton } from "react-calendly";

import "../../../styles/User-styles/calendar.css";


const Calendly = () => {
  return (

    <div className="calendly-container">
      <h2 className="calendly-title">Schedule a <span className="green-text">training</span> session</h2>
      <p className="calendly-description">
        Book a personalized training session with one of our expert trainers.
        Simply click the button below to select a time that suits you.
      </p>
      <PopupButton
        url="https://calendly.com/josejoakin10"
        rootElement={document.getElementById("app")}
        text="Click here to schedule a training session!"
        className="calendly-button"

      />
    </div>

  );
};

export default Calendly;


