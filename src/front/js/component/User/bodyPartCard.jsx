import React from "react";
import { Dumbbell } from "lucide-react";
import "../../../styles/User-styles/bodyPartCard.css";

const BodyPartCard = ({ item, setBodyPart, bodyPart }) => {
  return (
    <div
      className="card body-part-card-container"
      onClick={() => {
        setBodyPart(item)
        window.scrollTo({ top: 1000, left: 100, behavior: 'smooth' })
      }}
    >
      <Dumbbell size={50} color="#8BC34A" strokeWidth={1.75} />
      <div className="card-body">
        <p className="card-text part-name">{item}</p>
      </div>
    </div>
  );
};

export default BodyPartCard;
