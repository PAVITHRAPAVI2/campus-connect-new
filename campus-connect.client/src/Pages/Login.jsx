import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css'; 
import BASE_URL from '../config.js'; 


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
                password
            });

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('userName', response.data.userName || collegeId);
                navigate('/faculty');
            } else {
                setError('Invalid login credentials');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errMsg =
                    err.response?.data?.message ||
                    (err.code === 'ERR_NETWORK'
                        ? 'Network error: Cannot connect to the server.'
                        : 'Login failed. Please try again.');
                setError(errMsg);

                console.error('Axios error:', {
                    message: err.message,
                    code: err.code,
                    method: err.config?.method,
                    url: err.config?.url,
                    status: err.response?.status,
                    data: err.response?.data,
                });
            } else {
                setError('Unexpected error occurred.');
                console.error('Unexpected error:', err);
            }
        }
    };

    return (
        <>
            
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
            
        </>
    );
};

export default LoginPage;