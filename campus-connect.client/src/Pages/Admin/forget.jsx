import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forget.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required');
            return;
        }
        setError('');
        setMessage(`OTP sent to ${email}`);
        setStep(2);
        setTimeout(() => setMessage(''), 3000); // hide after 3s
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (!otp) {
            setError('OTP is required');
            return;
        }
        setError('');
        setMessage(`OTP verified for ${email}`);
        setStep(3);
        setTimeout(() => setMessage(''), 3000); // hide after 3s
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            setError('Both password fields are required');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        setMessage('Password has been reset successfully!');
        setTimeout(() => {
            setMessage('');
            navigate('/login');
        }, 2000);
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>

            <form onSubmit={
                step === 1
                    ? handleSendOtp
                    : step === 2
                        ? handleVerifyOtp
                        : handleResetPassword
            }>
                <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={step > 1}
                />

                {step >= 2 && (
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        readOnly={step === 3}
                    />
                )}

                {step === 3 && (
                    <>
                        <input
                            type="password"
                            placeholder="Enter New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </>
                )}

                <button type="submit">
                    {step === 1 ? 'Send OTP' : step === 2 ? 'Verify' : 'Reset Password'}
                </button>
            </form>

            {error && <p className="error-msg">{error}</p>}
            {message && <p className="plain-msg">{message}</p>} {/* ✨ Plain message */}
        </div>
    );
};

export default ForgotPassword;
