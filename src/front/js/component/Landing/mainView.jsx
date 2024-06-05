import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext.js";

import "./../../../styles/Landing-styles/mainView.css";
import { SignUp } from "./SignUp.jsx";
import About from "./about.jsx";
import Services from "./services.jsx";

const MainView = () => {
  const { store, actions } = useContext(Context);
  const [loggedin, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!store.token);
  }, [store.token]);

  return (
    <>
      <div id="home" className="main-view-container">
        <article className="text-container background-slider">
          <div className="text-wrapper">
            <div className="left-text-container">
              <h2 className="landing-text-left">
                <span className="green-text">FREE</span> YOUR BODY
              </h2>
            </div>
            <div className="right-text-container">
              <h2 className="landing-text-right">
                GET FIT WITH <span className="green-text">MKJ</span>
              </h2>
            </div>
          </div>
          {!loggedin && (
            <div className="signup-container">
              <SignUp />
            </div>
          )}
        </article>
      </div>
      <section id="about" className="about-section">
        <About />
      </section>
      <section id="services" className="services-section">
        <Services />
      </section>
    </>
  );
};

export default MainView;