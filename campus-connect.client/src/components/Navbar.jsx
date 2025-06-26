import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styless/navbar.css';
import BASE_URL from '../config';

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get(`${BASE_URL}/Auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data); // should contain { name, role, ... }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/');
    };

    return (
        <header className="navbar">
            <div className="logo" onClick={() => navigate('/')}>Campus Connect</div>
            <div className="nav-buttons">
                {user ? (
                    <>
                        <span className="welcome-msg">
                            {user.name}
                            <span className="badge">{user.role}</span>
                        </span>
                        <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button className="btn login-btn" onClick={() => navigate('/login')}>Login</button>
                        <button className="btn signup-btn" onClick={() => navigate('/register')}>Sign Up</button>
                    </>
                )}
            </div>
        </header>
    );
}

export default Navbar;
