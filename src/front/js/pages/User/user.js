import React, { useState } from "react";
import PersonalData from "../../component/User/PersonalData.jsx";
import Calendly from "../../component/User/calendar.jsx";
import Exercises from "../../component/User/exercises.jsx";
import SearchExercises from "../../component/User/searchExercises.jsx";
import UserRoutine from "../../component/User/showRutine.jsx";
import "../../../styles/User-styles/userView.css"

export const User = () => {
    const [exercises, setExercises] = useState([]);
    const [bodyPart, setBodyPart] = useState('all');

    return (
        <div className="user-container">
            <div className="user-header">
                <div className="user-data">
                    <PersonalData classname="personalData" />
                </div>
                <div className="user-calendar">
                    <Calendly />
                </div>
            </div>
            <div className="user-routine">
                <UserRoutine />
            </div>
            <div className="search-exercise">
                <SearchExercises setExercises={setExercises} bodyPart={bodyPart} setBodyPart={setBodyPart} />
            </div>
            <div className="exercises">
                <Exercises setExercises={setExercises} exercises={exercises} bodyPart={bodyPart} />
            </div>
        </div>
    );
};
