import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';
import BASE_URL from '../config';

const LoginPage = () => {
    const [collegeId, setCollegeId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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
                password,
            });

            const { token, userId, userName, role, department } = response.data;

            if (token) {
                // Save individual values
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('userName', userName || collegeId);
                localStorage.setItem('role', role);
                localStorage.setItem('department', department || '');

                // Save full user object
                const user = {
                    name: userName || collegeId,
                    role,
                    collegeId: userId,
                    department: department || ''
                };
                localStorage.setItem('user', JSON.stringify(user));

                // Navigate to role-based dashboard
                if (role === 'student') {
                    navigate('/student');
                } else if (role === 'faculty') {
                    navigate('/faculty');
                } else if (role === 'admin') {
                    navigate('/admin');
                } else {
                    setError('Unknown user role');
                }
            } else {
                setError('Invalid login credentials');
            }
        } catch (err) {
            const errMsg = axios.isAxiosError(err)
                ? err.response?.data?.message || 'Network error: Cannot connect to the server.'
                : 'Unexpected error occurred.';
            setError(errMsg);
        }
    };

    return (
        <div className="login-wrapper">
            <form className="login-container" onSubmit={handleSubmit}>
                <h2>Login</h2>

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
                    <a href="#">Forgot Password?</a>
                </div>

                <button type="submit">Login</button>

                {error && <p className="error-msg">{error}</p>}

                <div className="register-link">
                    <p>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
