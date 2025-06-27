import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './studentstyle/StuDashboardLayout.css';

const DashboardLayout = ({ children }) => {
    const [openChatDropdown, setOpenChatDropdown] = useState(false);
    const navigate = useNavigate();

    // Check if token exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const user = {
        name: localStorage.getItem('fullName') || 'User',
        role: localStorage.getItem('role') || 'Unknown',
        department: localStorage.getItem('userDepartment') || 'CSE',
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login', { replace: true });
    };

    return (
        <div className="dashboard-container">
            {/* Top Navbar */}
            <header className="navbar">
                <div className="navbar-left">Campus Connect</div>
                <div className="navbar-right">
                    <span className="icon">🔔</span>
                    <span className="icon">💬</span>
                    <span className="user-info">
                        {user.name}
                        <span className="badge">{user.role}</span>
                    </span>
                </div>
            </header>

            {/* Main Layout */}
            <div className="dashboard-body">
                <main className="main-content">{children}</main>

                {/* Sidebar */}
                <aside className="sidebar">
                    <nav>
                        <ul>
                            <li><Link to="/student">Dashboard</Link></li>
                            <li><Link to="/profile">Profile</Link></li>
                            <li><Link to="/notices">Notice Board</Link></li>

                            {/* Group Chat Dropdown */}
                            <li className={`dropdown ${openChatDropdown ? 'open' : ''}`}>
                                <button
                                    className="dropdown-btn"
                                    onClick={() => setOpenChatDropdown(!openChatDropdown)}
                                >
                                    Group Chat <span className="caret">{openChatDropdown ? '▲' : '▼'}</span>
                                </button>

                                {openChatDropdown && (
                                    <ul className="dropdown-list">
                                        <li><Link to="/commonchat">Common Chat</Link></li>
                                        <li>
                                            <Link to="/depchat">
                                                {user.department} Department Chat
                                            </Link>

                                        </li>
                                    </ul>
                                )}
                            </li>


                            <li>
                                <button className="logout-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>
            </div>

            {/* Footer */}
            <footer className="footer">
                © 2024 Campus Connect. All rights reserved.
            </footer>
        </div>
    );
};

export default DashboardLayout;