import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

function Navbar() {
    const navigate = useNavigate();

    return (
        <header className="navbar">
            <div className="logo">CampusConnect</div>
            <div className="nav-buttons">
                <button
                    className="btn login-btn"
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>
                <button

                    className="btn signup-btn"
                    onClick={() => navigate('/register')}
                >
                    Sign Up
                </button>
            </div>
        </header>
    );
}

export default Navbar;
