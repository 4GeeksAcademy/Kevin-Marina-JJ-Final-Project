import React, { useContext, useEffect, useState } from 'react';
import { Context } from "../../store/appContext";
import { useNavigate } from 'react-router-dom';

import "../../../styles/User-styles/editForm.css";

export const EditForm = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_name: '',
    user_height: '',
    user_weight: '',
    user_illness: '',
    user_objetives: '',
    user_age: ''
  });

  useEffect(() => {
    if (!store.user_data) {
      actions.fetchUserData();
    } else {
      setFormData(store.user_data);
    }
  }, [store.user_data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await actions.patchUserData(formData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/user/${store.user_id}`);
  };

  return (
    <div className="container-form">
      <h2 className='form-title'>Edit User <span className='green-text'>Information</span></h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label className='form-label'>
            Full Name:
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className='form-input'
              required
            />
          </label>
          <br />
          <label className='form-label'>
            Age:
            <input
              type="number"
              name="user_age"
              value={formData.user_age}
              onChange={handleChange}
              className='form-input'
              required
            />
          </label>
          <br />
          <label className='form-label'>
            Height (cm):
            <input
              type="number"
              name="user_height"
              value={formData.user_height}
              onChange={handleChange}
              placeholder="000"
              className='form-input'
              required
            />
          </label>
          <br />
          <label className='form-label'>
            Weight (kg):
            <input
              type="number"
              name="user_weight"
              value={formData.user_weight}
              onChange={handleChange}
              pattern="\d+(\.\d{1,2})?"
              placeholder="00.00"
              className='form-input'
              required
            />
          </label>
          <br />
          <label className='form-label'>
            Illness:
            <input
              type="text"
              name="user_illness"
              value={formData.user_illness}
              onChange={handleChange}
              className='form-input'
              required
            />
          </label>
          <br />
          <label className='form-label'>
            Objectives:
            <input
              type="text"
              name="user_objetives"
              value={formData.user_objetives}
              onChange={handleChange}
              className='form-input'
            />
          </label>
          <br />
          <button type="submit" className='form-button'>Confirm</button>
          <button className='form-button close-btn' onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate(`/user/${store.user_id}`);

          }}>Return to User Page</button>
        </form>

      </div>
    </div>
  );
}
