// src/components/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './styles/DashboardLayout.css';

const DashboardLayout = () => {
    const [openChatDropdown, setOpenChatDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        const token = localStorage.getItem('token');
        if (!token || role?.toLowerCase() !== 'faculty') {
            navigate('/login');
        }
    }, [navigate]);

    const user = {
        name: localStorage.getItem('userName') || 'User',
        role: localStorage.getItem('userRole') || 'Unknown',
        department: localStorage.getItem('userDepartment') || 'CSE',
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
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

            <div className="dashboard-body">
                <aside className="sidebar">
                    <nav>
                        <ul>
                            <li><Link to="/faculty">Dashboard</Link></li>
                            <li><Link to="/faculty/notice-board">Notice Board</Link></li>
                            <li>
                                <button
                                    className="dropdown-btn"
                                    onClick={() => setOpenChatDropdown(!openChatDropdown)}
                                >
                                    Group Chat {openChatDropdown ? '▲' : '▼'}
                                </button>
                                {openChatDropdown && (
                                    <ul className="dropdown-list">
                                        <li><Link to="/faculty/group-chat">Common Chat</Link></li>
                                        <li>
                                            <Link to={`/chat/department/${user.department.toLowerCase()}`}>
                                                {user.department} Department Chat
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li><Link to="/faculty/student-approvals">Student Approvals</Link></li>
                            <li><Link to="/faculty/manage-students">Manage Students</Link></li>
                            <li>
                                <button className="logout-btn" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>

                <main className="main-content">
                    <Outlet />
                </main>
            </div>

            <footer className="footer">
                © 2024 Campus Connect. All rights reserved.
            </footer>
        </div>
    );
};

export default DashboardLayout;
