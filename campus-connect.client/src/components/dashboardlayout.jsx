import React, { useState } from 'react';
import './dashboardlayout.css';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const [showGroupChatMenu, setShowGroupChatMenu] = useState(false);

    const toggleGroupChat = () => {
        setShowGroupChatMenu(!showGroupChatMenu);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const userName = localStorage.getItem('userName') || 'User';
    const userRole = localStorage.getItem('userRole') || 'Role';

    return (
        <div className="dashboard-container">
            {/* Top Navbar */}
            <header className="navbar">
                <div className="navbar-left">Campus Connect</div>
                <div className="navbar-right">
                    <span className="icon">🔔</span>
                    <span className="icon">💬</span>
                    <span className="user-info">
                        {userName}
                        <span className="badge">{userRole}</span>
                    </span>
                </div>
            </header>

            {/* Main Body */}
            <div className="dashboard-body">
                {/* Sidebar on the left */}
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
                                        <div onClick={() => navigate('/cschat')}>Department Chat</div>
                                    </div>
                                )}
                            </li>

                            <li onClick={() => navigate('/managefaculty')}>Manage Faculty</li>
                            {/*<li onClick={() => navigate('/studentapproval')}>Student Approval</li>*/}
                            <li onClick={() => navigate('/usermanagement')}>Manage Students</li>

                            {/* Logout Button right below "Manage Students" */}
                            <li>
                                <button className="logout-btn-sidebar" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="main-content">{children}</main>
            </div>

            {/* Footer */}
            <footer className="footer">© 2024 Campus Connect. All rights reserved.</footer>
        </div>
    );
};

export default DashboardLayout;
