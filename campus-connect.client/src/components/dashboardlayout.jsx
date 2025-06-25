import React from 'react';
import './dashboardlayout.css';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <header className="navbar">
                <div className="navbar-left">Campus Connect</div>
                <div className="navbar-right">
                    <span className="icon">🔔</span>
                    <span className="icon">💬</span>
                    <span className="user-info">
                        Dr. Sarah Johnson
                        <span className="badge">Faculty</span>
                    </span>
                </div>
            </header>

            <div className="dashboard-body">
                <main className="main-content">{children}</main>

                <aside className="sidebar">
                    <nav>
                        <ul>
                            <li>Dashboard</li>
                            <li>Notice Board</li>
                            <li>Group Chat</li>
                            <li onClick={() => navigate('/managefaculty')} style={{ cursor: 'pointer' }}>
                                Manage Faculty
                            </li>
                            <li onClick={() => navigate('/usermanagement')} style={{ cursor: 'pointer' }}>
                                Manage Students
                            </li>
                        </ul>
                    </nav>
                </aside>
            </div>

            <footer className="footer">© 2024 Campus Connect. All rights reserved.</footer>
        </div>
    );
};

export default DashboardLayout;
