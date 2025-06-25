import React, { useState } from 'react';
import './dashboardlayout.css';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const [showGroupChatMenu, setShowGroupChatMenu] = useState(false);

    const toggleGroupChat = () => {
        setShowGroupChatMenu(!showGroupChatMenu);
    };

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
                            <li onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                                Dashboard
                            </li>

                            {/* Group Chat Dropdown */}
                            <li style={{ cursor: 'pointer' }}>
                                <div
                                    onClick={toggleGroupChat}
                                    style={{
                                        background: '#e6f4ff',
                                        border: '1px solid #007bff',
                                        padding: '10px',
                                        borderRadius: '10px',
                                        textAlign: 'center'
                                    }}
                                >
                                    <strong>Group Chat</strong> {showGroupChatMenu ? '▲' : '▼'}
                                </div>
                                {showGroupChatMenu && (
                                    <div style={{ background: '#e6f4ff', padding: '10px' }}>
                                        <div
                                            style={{ cursor: 'pointer', textDecoration: 'underline', marginBottom: '5px' }}
                                            onClick={() => navigate('/groupchat')}
                                        >
                                            Common Chat
                                        </div>
                                        <div
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => navigate('/cschat')}
                                        >
                                            CS Department Chat
                                        </div>
                                    </div>
                                )}
                            </li>

                            <li onClick={() => navigate('/managefaculty')} style={{ cursor: 'pointer' }}>
                                Manage Faculty
                            </li>
                            <li onClick={() => navigate('/usermanagement')} style={{ cursor: 'pointer' }}>
                                Manage Students
                            </li>
                            <li onClick={() => navigate('/notices')} style={{ cursor: 'pointer' }}>
                                Notice Board
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
