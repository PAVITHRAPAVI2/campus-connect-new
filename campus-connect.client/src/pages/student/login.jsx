import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer"; // <-- Import Footer

const LoginPage = () => {
    const [loginName] = useState('');
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!loginName || !loginId || !password) {
            setError('Please fill in all fields');
        } else {
            setError('');
            console.log('Login submitted:', { loginName, loginId, password });
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
                        placeholder="Login ID"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
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

            <Footer /> {/* Add footer here */}
        </>
    );
};

export default LoginPage;
