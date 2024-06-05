import React from 'react';
import { FaRegTrashAlt } from "react-icons/fa";
import '../../../styles/Trainer-styles/exerciseTable.css';

const ExerciseTable = ({ routine, handleRemoveExercise }) => {
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return (
        <table className="exercise-table">
            <thead>
                <tr>
                    {daysOfWeek.map(day => (
                        <th key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {daysOfWeek.map(day => (
                        <td key={day}>
                            <ul>
                                {routine[day].length === 0 ? (
                                    <li>Rest day</li>
                                ) : (
                                    routine[day].map((exercise, index) => (
                                        <li key={index} className="exercise-item">
                                            {exercise}
                                            <span onClick={() => handleRemoveExercise(day, index)} className="remove-exercise"> <FaRegTrashAlt /></span>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    );
};

export default ExerciseTable;
