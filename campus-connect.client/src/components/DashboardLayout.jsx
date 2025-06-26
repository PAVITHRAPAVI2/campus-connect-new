import React, { useState } from 'react';
import './Styless/DashboardLayout.css';
import { Link } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const [openChatDropdown, setOpenChatDropdown] = useState(false);

    // Replace with actual user info from context or props
    const user = {
        name: 'Dr. Sarah Johnson',
        role: 'Faculty',
        department: 'CS', // This can be dynamically loaded
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

            {/* Main content + Right Sidebar */}
            <div className="dashboard-body">
                <main className="main-content">{children}</main>

                <aside className="sidebar">
                    <nav>
                        <ul>
                            <li><Link to="/faculty">Dashboard</Link></li>
                            <li><Link to="/faculty/Notice">Notice Board</Link></li>
                            <li>
                                <button
                                    className="dropdown-btn"
                                    onClick={() => setOpenChatDropdown(!openChatDropdown)}
                                >
                                    Group Chat {openChatDropdown ? '▲' : '▼'}
                                </button>
                                {openChatDropdown && (      
                                    <ul className="dropdown-list">
                                        <li>
                                            <Link to="/faculty/Groupchat">Common Chat</Link>
                                        </li>
                                        <li>
                                            <Link to={`/chat/department/${user.department.toLowerCase()}`}>
                                                {user.department} Department Chat
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li><Link to="/faculty/Approval">Student Approvals</Link></li>
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
