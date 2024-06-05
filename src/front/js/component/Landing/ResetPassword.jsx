import navigate from 'navigate';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(`${process.env.BACKEND_URL}/reset_password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });
        if (response.ok) {
            Swal.fire({
                title: 'Password has been reset successfully',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            });
            navigate('/');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
            />
            <button type="submit">Reset Password</button>
        </form>
    );
};

export default ResetPassword;