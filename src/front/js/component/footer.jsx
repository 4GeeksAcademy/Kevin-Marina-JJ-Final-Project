import React from "react";

import "../../styles/footer.css";
import { CiLinkedin } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";



export const Footer = () => (
  <footer className="footer gym-footer text-center pb-1 pt-1" id="footer">
    <ul className="footer-list media-list">
      <li className="github social-icon">
        <a
          className="link aw-independent link_footer"
          href="https://github.com/Marinamb19"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub className="github" />
          <span className="footer-text">Marina</span>

        </a>
      </li>

      <li className="linkedin social-icon">
        <a
          className="link aw-independent link_footer"
          href="https://www.linkedin.com/in/marina-martín-barranco-7a6316247"
          target="_blank"
          rel="noopener noreferrer"
        >
          <CiLinkedin className="linkedin" />
          <span className="footer-text">Marina</span>

        </a>
      </li>


      <li className="github social-icon">
        <a
          className="link aw-independent link_footer"
          href="https://github.com/KevinGaBo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub className="github" />
          <span className="footer-text">Kevin</span>

        </a>
      </li>

      <li className="linkedin social-icon">
        <a
          className="link aw-independent link_footer"
          href="https://www.linkedin.com/in/kevin-boriosi-61261126b/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <CiLinkedin className="linkedin" />
          <span className="footer-text">Kevin</span>

        </a>
      </li>


      <li className="github social-icon">
        <a
          className="link aw-independent link_footer"
          href="https://github.com/JoseJoaquinMartinez"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub className="github" />
          <span className="footer-text">Jose Joaquin</span>

        </a>
      </li>

      <li className="linkedin social-icon">
        <a
          className="link aw-independent link_footer"
          href="https://www.linkedin.com/in/josé-joaquín-martínez-carrillo-66621a173"
          target="_blank"
          rel="noopener noreferrer"
        >
          <CiLinkedin className="linkedin" />
          <span className="footer-text">Jose Joaquin</span>

        </a>
      </li>

    </ul>
  </footer>

);
