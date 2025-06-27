import React, { useState, useEffect } from 'react';
import './dashboardlayout.css';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
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
