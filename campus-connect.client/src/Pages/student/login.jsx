import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BASE_URL from '../../config.js';

const LoginPage = () => {
    const [collegeId, setCollegeId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!collegeId || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/Auth/login`, {
                collegeId,
                password
            });

            console.log("Login Response:", response.data);

            const token = response.data.token;
            const userId = response.data.userId;
            const userName = response.data.userName || "User";
            const userRole = response.data.role || "Role";

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId || '');
                localStorage.setItem('userName', userName);
                localStorage.setItem('userRole', userRole);

                setSuccessMessage('Login successful! Redirecting...');
                setError('');

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                setError('Invalid login credentials');
                setSuccessMessage('');
            }
        } catch (err) {
            const errMsg =
                err.response?.data?.message ||
                (err.code === 'ERR_NETWORK'
                    ? 'Network error: Cannot connect to the server.'
                    : 'Login failed. Please try again.');

            setError(errMsg);
            setSuccessMessage('');
        }
    };

    return (
        <>
            <Navbar />

            <div className="login-wrapper">
                <form className="login-container" onSubmit={handleSubmit}>
                    <h2>Login</h2>

                    <input
                        type="text"
                        placeholder="College Id"
                        value={collegeId}
                        onChange={(e) => setCollegeId(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="forgot-password">
                        <Link to="/forget">Forgot Password?</Link>
                    </div>

                    <button type="submit">Login</button>

                    {error && <p className="error-msg">{error}</p>}
                    {successMessage && <p className="success-msg">{successMessage}</p>}
                </form>
            </div>

            <Footer />
        </>
    );
};

export default LoginPage;
