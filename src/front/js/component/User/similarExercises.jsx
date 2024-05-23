import React from "react";
import HorizontalScrollbar from "../User/horizontalScrollbar.jsx";
import Loader from "./loader.jsx";
import "../../../styles/User-styles/similarExercises.css";

const SimilarExercises = ({ targetMuscleExercises, equipmentExercises }) => {
  return (
    <div className="similar-exercises-container">
      <h3 className="similar-exercises-heading">
        Similar <span className="highlight">Target Muscle</span> exercises
      </h3>
      <div className="similar-exercises-scroll-container">
        {targetMuscleExercises.length !== 0 ? (
          <HorizontalScrollbar data={targetMuscleExercises} />
        ) : (
          <Loader />
        )}
      </div>
      <h3 className="similar-exercises-heading">
        Similar <span className="highlight">Equipment</span> exercises
      </h3>
      <div className="similar-exercises-scroll-container">
        {equipmentExercises.length !== 0 ? (
          <HorizontalScrollbar data={equipmentExercises} />
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default SimilarExercises;
