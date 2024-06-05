import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../../store/appContext";
import { useNavigate } from 'react-router-dom';
import Loader from "../User/loader.jsx";
import Swal from 'sweetalert2';

import AvatarDefault from "../../../img/avatar-default.png";

import "../../../styles/User-styles/PersonalData.css";

const PersonalData = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!store.user_data) {
      actions.fetchUserData();
    }
  }, [store.user_id]);

  const handleEditForm = () => {
    navigate("/user/edit_form");
  };

  /* useEffect(() => {
    const getUserImage = async () => {
      await actions.fetchUserImage();
    };
    getUserImage();
  }, [store.user_image]);



  useEffect(() => {
    if (!store.user_image) {
      setImage(AvatarDefault);
    } else {
      setImage(store.user_image);
    }
  }, [store.user_image]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadImage = async () => {
    if (selectedFile) {
      await actions.updateUserImage(selectedFile);
      setShowFileInput(false);
      setSelectedFile(null);
    }
  }; */

  if (!store.user_data) {
    return (
      <>
        <h4>Loading...</h4>
        <Loader />
      </>
    );
  }

  return (
    <div className='personalData'>
      {/* <img src={image} alt="user-image" className='user-image' />
      {!showFileInput && (
        <button onClick={() => setShowFileInput(true)} className="change-profile-pic-btn">Change Profile Picture</button>
      )}
      {showFileInput && (
        <div className="file-input-container">
          <input type="file" onChange={handleFileChange} />
          <button
            onClick={handleUploadImage}
            disabled={!selectedFile}
            className="upload-img-btn">
            Upload Picture
          </button>
        </div>
      )} */}
      <div className='user-info'>
        <h2 className='user-info-title'>Personal <span className='green-text'>Information</span> </h2>
        <p className='dataForm'><span className='green-text dataForm-title'>Full Name:</span> {store.user_data.user_name}</p>
        <p className='dataForm'><span className='green-text dataForm-title'>Age:</span> {store.user_data.user_age}</p>
        <p className='dataForm'><span className='green-text dataForm-title'>Weight:</span> {store.user_data.user_weight}</p>
        <p className='dataForm'><span className='green-text dataForm-title'>Illness:</span> {store.user_data.user_illness}</p>
        <p className='dataForm'><span className='green-text dataForm-title'>Height:</span> {store.user_data.user_height}</p>
        <p className='dataForm'><span className='green-text dataForm-title'>Objectives:</span> {store.user_data.user_objetives}</p>
      </div>
      <button onClick={handleEditForm} className="edit-user-btn">Edit User Info</button>
    </div>
  );
};

export default PersonalData;
