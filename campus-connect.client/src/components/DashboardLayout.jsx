import React, { useState } from 'react';
import './Styles/DashboardLayout.css';
import { Link, Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    const [openChatDropdown, setOpenChatDropdown] = useState(false);

    // Sample user data – replace with actual context or API data
    const user = {
        name: 'Dr. Sarah Johnson',
        role: 'Faculty',
        department: 'CS',
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

            {/* Body layout */}
            <div className="dashboard-body">
                {/* Sidebar */}
                <aside className="sidebar">
                    <nav>
                        <ul>
                            <li><Link to="/faculty">Dashboard</Link></li>
                            <li><Link to="/faculty/notice-board">Notice Board</Link></li>

                            {/* Group Chat Dropdown */}
                            <li>
                                <button
                                    className="dropdown-btn"
                                    onClick={() => setOpenChatDropdown(!openChatDropdown)}
                                >
                                    Group Chat {openChatDropdown ? '▲' : '▼'}
                                </button>
                                {openChatDropdown && (
                                    <ul className="dropdown-list">
                                        <li><Link to="/chat/common">Common Chat</Link></li>
                                        <li>
                                            <Link to={`/chat/department/${user.department.toLowerCase()}`}>
                                                {user.department} Department Chat
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            <li><Link to="/faculty/student-approvals">Student Approvals</Link></li>
                        </ul>
                    </nav>
                </aside>

                {/* Main content (renders nested routes here) */}
                <main className="main-content">
                    <Outlet /> {/* This renders the nested route components */}
                </main>
            </div>

            {/* Footer */}
            <footer className="footer">
                © 2024 Campus Connect. All rights reserved.
            </footer>
        </div>
    );
};

export default DashboardLayout;
