import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './forget.css';
import BASE_URL from '../../config'; // your API base URL

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await axios.post(`${BASE_URL}/Auth/forgot-password`, {
                email: email.trim().toLowerCase()
            });
            setMessage(res.data || 'OTP sent to your email.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data || 'Failed to send OTP');
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await axios.post(`${BASE_URL}/Auth/verify-otp`, {
                email: email.trim().toLowerCase(),
                otp: otp
            });
            setMessage(res.data || 'OTP verified successfully');
            setStep(3);
        } catch (err) {
            setError(err.response?.data || 'Invalid or expired OTP');
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!newPassword || !confirmPassword) {
            setError('Both password fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const res = await axios.post(`${BASE_URL}/Auth/reset-password`, {
                email: email.trim().toLowerCase(),
                newPassword,
                confirmPassword
            });
            setMessage(res.data || 'Password reset successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data || 'Failed to reset password');
        }
    };

    const handleSubmit = (e) => {
        if (step === 1) return handleSendOtp(e);
        else if (step === 2) return handleVerifyOtp(e);
        else return handleResetPassword(e);
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={step > 1}
                    required
                />

                {step >= 2 && (
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        readOnly={step === 3}
                        required
                    />
                )}

                {step === 3 && (
                    <>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </>
                )}

                <button type="submit">
                    {step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'}
                </button>
            </form>

            {error && <p className="error-msg">{error}</p>}
            {message && <p className="plain-msg">{message}</p>}
        </div>
    );
};

export default ForgotPassword;
