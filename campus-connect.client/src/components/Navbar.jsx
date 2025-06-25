import React from 'react';
import './styles/navbar.css'; // Make sure the path and folder name are correct

function Navbar() {
    return (
        <header className="navbar">
            <div className="logo">CampusConnect</div>
            <div className="nav-buttons">
                <button className="btn login-btn">Login</button>
                <button className="btn signup-btn">Sign Up</button>
            </div>
        </header>
    );
}

export default Navbar;
