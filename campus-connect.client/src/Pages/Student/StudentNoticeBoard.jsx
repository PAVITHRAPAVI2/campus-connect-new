// src/pages/Student/StudentNoticeBoard.jsx

import React, { useState, useEffect } from "react";
import { FiCalendar, FiEye, FiMessageSquare } from "react-icons/fi";
import axios from "axios";

import DashboardLayout from "../../components/Styless/DashboardLayout";
import "../Student/student style/NoticeBoard.css";

const StudentNoticeBoard = () => {
    const [notices, setNotices] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get("https://campusconnect.tryasp.net/api/Notices");
                setNotices(response.data);
            } catch (err) {
                console.error("Failed to fetch notices:", err);
                setError("Failed to load notices.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    const filteredNotices = notices.filter((notice) =>
        notice.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="noticeboard-container">
                <div className="noticeboard-header">
                    <h2>Notice Board</h2>
                    <p>📢 For viewing announcements and campus updates only</p>
                </div>

                <div className="notice-filters">
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading notices...</div>
                ) : error ? (
                    <div style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>{error}</div>
                ) : filteredNotices.length === 0 ? (
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>No notices found.</div>
                ) : (
                    <div className="notices-list">
                        {filteredNotices.map((notice) => (
                            <div key={notice.id} className="notice-card">
                                <div className="notice-tags">
                                    <span className={`tag ${notice.priority?.toLowerCase()}`}>
                                        {notice.priority} Priority
                                    </span>
                                    <span className="tag category">{notice.category}</span>
                                    {notice.pin && <span className="pin">📌</span>}
                                </div>

                                <h3>{notice.title}</h3>

                                <div className="notice-meta">
                                    <span>👤 {notice.author}</span>
                                    <span>
                                        <FiCalendar /> {new Date(notice.date).toLocaleString()}
                                    </span>
                                    <span>🏫 {notice.department}</span>
                                </div>

                                <p className="notice-content">{notice.content}</p>

                                <div className="notice-footer">
                                    <span>
                                        <FiEye /> {notice.views || 0} views
                                    </span>
                                    <span>
                                        <FiMessageSquare /> {notice.comments || 0} comments
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StudentNoticeBoard;
