import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/User-styles/exerciseCard.css";

const ExerciseCard = ({ exercise }) => {
  return (
    <Link className="exercise-card" to={`/exercise/${exercise.id}`}>
      <div className="exercise-card-container">
        <img src={exercise.gifUrl} alt={exercise.name} loading="lazy" className="exercise-card-image" />
        <div className="card-body">
          <span className="primary-muscle">{exercise.bodyPart}</span>
          <span className="primary-muscle">{exercise.target}</span>
          <p className="card-text part-name">{exercise.name}</p>
        </div>
      </div>
    </Link>
  );
};

export default ExerciseCard;
