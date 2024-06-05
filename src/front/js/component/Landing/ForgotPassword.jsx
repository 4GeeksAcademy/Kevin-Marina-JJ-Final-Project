import React, { useState } from 'react';
import Swal from 'sweetalert2';
import "../../../styles/Landing-styles/resetPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(`${process.env.BACKEND_URL}/reset_password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        if (response.ok) {
            Swal.fire({
                title: 'Password reset email has been sent',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            });
        } else {
            const data = await response.json();
            alert(data.message);
        }

    };

    return (
        <form onSubmit={handleSubmit} className='reset-password-form'>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
            />
            <button type="submit">Reset Password</button>
        </form>
    );
};

export default ForgotPassword;
