import React from 'react';
import './navbar.css'; // ✅ correct relative path

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
