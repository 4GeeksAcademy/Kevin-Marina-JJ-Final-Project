import React from "react";
import "../../../styles/User-styles/exerciseDetail.css";

import EquipmentImage from "../../../img/equipment.png";
import BodyPartImage from "../../../img/body-part.png";
import TargetImage from "../../../img/target-image.png";

const Detail = ({ exerciseDetail }) => {
  const { bodyPart, gifUrl, name, target, equipment } = exerciseDetail;

  const extraDetail = [
    {
      icon: BodyPartImage,
      name: bodyPart,
    },
    {
      icon: TargetImage,
      name: target,
    },
    {
      icon: EquipmentImage,
      name: equipment,
    },
  ];

  return (
    <div className="detail-container">
      <img src={gifUrl} alt={name} loading="lazy" className="detail-img" />
      <div className="detail-text">
        <h3 className="detail-name">{name}</h3>
        <h6 className="detail-description">
          Exercises keep you strong. <span className="detail-exercise-name" style={{ textTransform: "capitalize" }}>{name}</span> bup is one
          of the best <br /> exercises to target your {target}. It will help you
          improve your <br /> mood and gain energy.
        </h6>
        {extraDetail?.map((item) => (
          <div key={item.name} className="detail-extra">
            <article className="detail-icon-container">
              <img
                src={item.icon}
                alt={bodyPart}
                className="detail-icon"
              />
            </article>
            <h5 className="detail-extra-name">{item.name}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Detail;
