import React from 'react';
import './Styless/navbar.css'; // or separate Navbar CSS if needed

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