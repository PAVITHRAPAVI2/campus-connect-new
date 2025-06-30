// src/components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/LoginPage.css';

import Navbar from './Navbar';
import Footer from './Footer';
import BASE_URL from '../config';

const LoginPage = () => {
    const [collegeId, setCollegeId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        if (token && role?.toLowerCase() === 'faculty') {
            navigate('/faculty');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!collegeId || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // ✅ Debug: Show what you're sending
            console.log("Attempting login:", { collegeId, password });

            const response = await axios.post(`${BASE_URL}/Auth/login`, {
                collegeId,     // 🔁 Replace with `username` or `email` if required
                password
            });

            const data = response.data;
            console.log("Login success:", data);

            if (data?.token && data?.role?.toLowerCase() === 'faculty') {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userName', data.userName || collegeId);
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('userDepartment', data.department );
                navigate('/faculty');
            } else {
                setError('Only Faculty can login here.');
            }
        } catch (err) {
            console.error("Login error:", err);

            if (axios.isAxiosError(err)) {
                const errMsg =
                    err.response?.data?.message ||
                    (err.code === 'ERR_NETWORK'
                        ? 'Network error. Please check your internet connection.'
                        : 'Login failed. Please check credentials.');
                setError(errMsg);
            } else {
                setError('Unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="login-wrapper">
                <form className="login-container" onSubmit={handleSubmit}>
                    <h2> Login</h2>

                    <input
                        type="text"
                        placeholder="College ID"
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
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    {error && <p className="error-msg">{error}</p>}

                    <div className="register-link">
                        <p>
                            Don't have an account? <Link to="/register">Register here</Link>
                        </p>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default LoginPage;
