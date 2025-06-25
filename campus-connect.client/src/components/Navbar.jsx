import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(localStorage.getItem('userName'));

    useEffect(() => {
        const updateUserName = () => {
            setUserName(localStorage.getItem('userName'));
        };

        // Update when localStorage changes
        window.addEventListener('storage', updateUserName);

        // Update on component mount
        updateUserName();

        return () => {
            window.removeEventListener('storage', updateUserName);
        };
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSignUp = () => {
        navigate('/register');
    };

    const handleLogout = () => {
        localStorage.clear();
        setUserName(null); // Manually update the state
        navigate('/');
    };

    return (
        <header className="navbar">
            <div className="logo" onClick={() => navigate('/')}>
                CampusConnect
            </div>
            <div className="nav-buttons">
                {userName ? (
                    <>
                        <span className="welcome-msg">Hi, {userName}</span>
                        <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button className="btn login-btn" onClick={handleLogin}>Login</button>
                        <button className="btn signup-btn" onClick={handleSignUp}>Sign Up</button>
                    </>
                )}
            </div>
        </header>
    );
}

export default Navbar;
