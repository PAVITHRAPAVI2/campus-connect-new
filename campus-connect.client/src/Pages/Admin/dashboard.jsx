import React from "react";
import DashboardLayout from '../../components/dashboardlayout';
import "./dashboard.css";

const DashboardContent = () => {
    const stats = [
        { label: "My Notices", value: 12 },
        { label: "Student Approvals", value: 3 },
        //{ label: "Total Views", value: 156, color: "green" }
    ];

    const activities = [
        { message: "3 student approvals pending", time: "1 hour ago" },
        { message: "New comment on your notice", time: "3 hours ago" },
        { message: "Message in Computer Science group", time: "5 hours ago" },
        { message: "Your notice has 25 new views", time: "1 day ago" }
    ];

    return (
        <div className="faculty-dashboard">
            <div className="welcome-banner">
                <h2>Good afternoon, Dr. Sarah!</h2>import React, {useState, useEffect} from 'react';
                import './dashboardlayout.css';
                import {useNavigate} from 'react-router-dom';

                const DashboardLayout = ({children}) => {
    const navigate = useNavigate();
                const [showGroupChatMenu, setShowGroupChatMenu] = useState(false);

                const [userName, setUserName] = useState('');
                const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
                const storedRole = localStorage.getItem('userRole');
                if (storedName) setUserName(storedName);
                if (storedRole) setUserRole(storedRole);
    }, []);

    const toggleGroupChat = () => {
                    setShowGroupChatMenu(!showGroupChatMenu);
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
                            {/*<span className="icon">🔔</span>*/}
                            {/*<span className="icon">💬</span>*/}
                            <span className="user-info">
                                {userName || 'User'}
                                <span className="badge">{userRole || 'Role'}</span>
                            </span>
                        </div>
                    </header>

                    <div className="dashboard-body">
                        <aside className="sidebar">
                            <nav className="sidebar-nav">
                                <ul>
                                    <li onClick={() => navigate('/dashboard')}>Dashboard</li>
                                    <li onClick={() => navigate('/notices')}>Notice Board</li>
                                    <li>
                                        <div onClick={toggleGroupChat} className="group-chat-toggle">
                                            <strong>Group Chat</strong> {showGroupChatMenu ? '▲' : '▼'}
                                        </div>
                                        {showGroupChatMenu && (
                                            <div className="group-chat-options">
                                                <div onClick={() => navigate('/groupchat')}>Common Chat</div>
                                                <div onClick={() => navigate('/depchart')}>Department Chat</div>
                                            </div>
                                        )}
                                    </li>
                                    <li onClick={() => navigate('/managefaculty')}>Manage Faculty</li>
                                    <li onClick={() => navigate('/usermanagement')}>Manage Students</li>
                                    <li>
                                        <button className="logout-btn-sidebar" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </aside>

                        <main className="main-content">{children}</main>
                    </div>

                    <footer className="footer">© 2024 Campus Connect. All rights reserved.</footer>
                </div>
                );
};

                export default DashboardLayout;

                <p>Welcome to your faculty dashboard. Here's what's happening in your campus community.</p>
            </div>

            <div className="stats-grid">
                {stats.map((item, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-label">{item.label}</div>
                        <div className={`stat-value ${item.color || ""}`}>{item.value}</div>
                    </div>
                ))}
            </div>

            <div className="recent-activity">
                <h3>Recent Activity</h3>
                <ul>
                    {activities.map((activity, index) => (
                        <li key={index} className="activity-item">
                            <span>{activity.message}</span>
                            <span className="time">{activity.time}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// This is the actual component that you will use in your router
const Dashboard = () => {
    return (
        <DashboardLayout>
            <DashboardContent />
        </DashboardLayout>
    );
};

export default Dashboard;
