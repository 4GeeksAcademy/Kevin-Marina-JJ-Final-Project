import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../../store/appContext";
import Loader from "../User/loader.jsx";
import "../../../styles/User-styles/showRutine.css";

const UserRoutine = () => {
    const { store, actions } = useContext(Context);
    const [routine, setRoutine] = useState(store.routine);
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    useEffect(() => {
        const fetchRoutine = async () => {
            if (!store.routine) {
                await actions.fetchDataRoutine();
            }
            setRoutine(store.routine);
        };

        fetchRoutine();
    }, [store.routine]);

    if (!routine) {
        return (
            <div className='routine-loader-title'>
                <h4 >No routine just yet.</h4>
                <Loader />
            </div>
        );
    }

    return (
        <div className='routine-container'>
            <h2 className='routine-title'>Your Current <span className='green-text'>Routine</span></h2>
            <div className='routine-table-container'>
                <table className='routine-table'>
                    <thead>
                        <tr>
                            {weekDays.map((day) => (
                                <th key={day} className='table-day'><span className='green-text'>{day}</span></th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {weekDays.map((day) => (
                                <td key={day} data-label={day}>
                                    <ul className='exercise-list'>
                                        {routine[day] && routine[day].length > 0 ? (
                                            routine[day].map((exercise, index) => (
                                                <li key={index} className='exercise-list-item'>{exercise}</li>
                                            ))
                                        ) : (
                                            <li>Rest Day</li>
                                        )}
                                    </ul>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserRoutine;
