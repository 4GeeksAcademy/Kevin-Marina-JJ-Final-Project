import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../../../styles/Trainer-styles/trainer.css";

import { Context } from "../../store/appContext";
import TrainerUserDetail from "./trainerUserDetail.js";
import TrainerCalendar from "../../component/Trainer/trainerCalendar.jsx";
import TrainerView from "../../component/Trainer/trainerView.jsx";
import TrainerExercise from "../../component/Trainer/trainerExercise.jsx";

export const Trainer = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="trainer-container">
            <TrainerCalendar />
            <TrainerView />
            <TrainerExercise />
            {/* <div className="trainer-exercise">
                <TrainerUserDetail />
            </div> */}
        </div>
    );
};
