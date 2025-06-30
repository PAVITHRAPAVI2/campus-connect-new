import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const [openChatDropdown, setOpenChatDropdown] = useState(false);
    const [user, setUser] = useState({
        name: localStorage.getItem("fullName") || "User",
        role: localStorage.getItem("role") || "Unknown",
        department: localStorage.getItem("userDepartment") || "CSE",
    });

    /* ── check token & (optionally) fetch profile ── */
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        // If name wasn't in storage, fetch it once
        if (!localStorage.getItem("fullName") || localStorage.getItem("fullName") === "undefined") {
            axios
                .get("https://campusconnect.tryasp.net/api/Auth/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(({ data }) => {
                    localStorage.setItem("fullName", data.fullName);
                    localStorage.setItem("role", data.role);
                    localStorage.setItem("userDepartment", data.department);
                    setUser({
                        name: data.fullName,
                        role: data.role,
                        department: data.department,
                    });
                })
                .catch(() => {
                    /* ignore – still show default */
                });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login", { replace: true });
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

                            {/* Group Chat */}
                            <li className={`dropdown ${openChatDropdown ? "open" : ""}`}>
                                <button
                                    className="dropdown-btn"
                                    onClick={() => setOpenChatDropdown(!openChatDropdown)}
                                >
                                    Group Chat <span className="caret">{openChatDropdown ? "▲" : "▼"}</span>
                                </button>
                                {openChatDropdown && (
                                    <ul className="dropdown-list">
                                        <li><Link to="/commonchat">Common Chat</Link></li>
                                        <li><Link to="/depchat">{user.department} Department Chat</Link></li>
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

            <footer className="footer">© 2024 Campus Connect. All rights reserved.</footer>
        </div>
    );
};

export default DashboardLayout;
