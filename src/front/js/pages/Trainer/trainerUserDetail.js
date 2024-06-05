import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../../store/appContext";
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


import Loader from "../../component/User/loader.jsx";
import TrainerExercise from '../../component/Trainer/trainerExercise.jsx';

import "../../../styles/Trainer-styles/trainerUserDetails.css";

const TrainerUserDetail = () => {
    const { userId } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        user_name: '',
        user_age: '',
        user_height: '',
        user_weight: '',
        user_illness: '',
        user_objetives: ''
    });

    useEffect(() => {
        const getUserData = async () => {
            const userData = await fetch(`${process.env.BACKEND_URL}/user_data/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + store.token
                }
            });
            if (userData.ok) {
                const data = await userData.json();
                setFormData(data);
            } else {
                Swal.fire({ title: "Error", text: "Error fetching user data", type: "error", showConfirmButton: false, timer: 1000 });
            }
        }
        getUserData();
    }, []);

    const handleDeleteUser = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0B3D91',
            cancelButtonColor: '#8BC34A',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            await actions.deleteUser(userId);
            navigate(`/trainer/${store.user_id}`);
        }
    }


    if (!formData) {
        return (
            <>
                <h4>Loading...</h4>
                <Loader />
            </>
        );
    }

    return (
        <section className="user-detail-view">
            <div className='personal-trainer-data'>
                <div className='user-info'>
                    <p className='dataForm'><span className='green-text dataForm-title'>Full Name:</span> {formData.user_name}</p>
                    <p className='dataForm'><span className='green-text dataForm-title'>Age:</span> {formData.user_age}</p>
                    <p className='dataForm'><span className='green-text dataForm-title'>Height:</span> {formData.user_height}</p>
                    <p className='dataForm'><span className='green-text dataForm-title'>Weight:</span> {formData.user_weight}</p>
                    <p className='dataForm'><span className='green-text dataForm-title'>Illness:</span> {formData.user_illness}</p>
                    <p className='dataForm'><span className='green-text dataForm-title'>Objectives:</span> {formData.user_objetives}</p>
                </div>
                <button onClick={handleDeleteUser} className="delete-user-btn">Delete User</button>
            </div>
            <TrainerExercise />
        </section>
    );
};

export default TrainerUserDetail
