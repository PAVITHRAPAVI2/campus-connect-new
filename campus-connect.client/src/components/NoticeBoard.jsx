import React, { useState, useEffect } from "react";
import "./styles/NoticeBoard.css";
import {
    FiCalendar, FiEye, FiMessageSquare, FiPlus
} from "react-icons/fi";
import axios from "axios";

const NoticeBoard = () => {
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [notices, setNotices] = useState([]);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState("");
    const [department, setDepartment] = useState("");
    const [content, setContent] = useState("");

    // 🔄 Fetch Notices from API
    useEffect(() => {
        axios.get("https://localhost:7144/api/Notices")
            .then(res => setNotices(res.data))
            .catch(err => console.error("Failed to load notices:", err));
    }, []);

    // 📝 Handle Publish
    const handlePublish = () => {
        const newNotice = {
            title,
            category,
            priority,
            department,
            content,
            author: "Admin", // Change as needed
            date: new Date().toISOString(),
            views: 0,
            comments: 0
        };

        axios.post("https://localhost:7144/api/Notices", newNotice)
            .then(res => {
                setNotices(prev => [res.data, ...prev]);
                setShowModal(false);
                setTitle(""); setCategory(""); setPriority(""); setDepartment(""); setContent("");
            })
            .catch(err => {
                console.error("Failed to post notice:", err);
                alert("Error creating notice");
            });
    };

    return (
        <div className="noticeboard-container">
            <div className="noticeboard-header">
                <h2>Notice Board</h2>
                <button className="create-btn" onClick={() => setShowModal(true)}>
                    <FiPlus /> Create Notice
                </button>
            </div>
            <p>Stay updated with campus announcements and events</p>

            <div className="notice-filters">
                <input
                    type="text"
                    placeholder="Search notices..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select>
                    <option>All Categories</option>
                    <option>Academic</option>
                    <option>Event</option>
                </select>
                <select>
                    <option>All Departments</option>
                    <option>Computer Science</option>
                    <option>IT Administration</option>
                    <option>Tamil</option>
                    <option>English</option>
                    <option>Maths</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                </select>
            </div>

            <div className="notices-list">
                {notices.map((notice) => (
                    <div key={notice.id} className="notice-card">
                        <div className="notice-tags">
                            <span className={`tag ${notice.priority?.toLowerCase()}`}>{notice.priority} Priority</span>
                            <span className="tag category">{notice.category}</span>
                            {notice.pin && <span className="pin">📌</span>}
                        </div>

                        <h3>{notice.title}</h3>
                        <div className="notice-meta">
                            <span>👤 {notice.author}</span>
                            <span><FiCalendar /> {new Date(notice.date).toLocaleString()}</span>
                            <span>🏫 {notice.department}</span>
                        </div>
                        <p className="notice-content">{notice.content}</p>
                        <div className="notice-footer">
                            <span><FiEye /> {notice.views || 0} views</span>
                            <span><FiMessageSquare /> {notice.comments || 0} comments</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Create New Notice</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                        </div>

                        <input
                            type="text"
                            placeholder="Enter notice title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <div className="modal-dropdowns">
                            <label>Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">-- Select Category --</option>
                                <option value="Academic">Academic</option>
                                <option value="Event">Event</option>
                                <option value="Announcement">Announcement</option>
                            </select>

                            <label>Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="">-- Select Priority --</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>

                            <label>Department</label>
                            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                                <option value="">-- Select Department --</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="IT Administration">IT Administration</option>
                                <option value="Tamil">Tamil</option>
                                <option value="English">English</option>
                                <option value="Maths">Maths</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Biology">Biology</option>
                            </select>
                        </div>

                        <textarea
                            placeholder="Enter the detailed content of your notice..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <div className="modal-actions">
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="publish-btn" onClick={handlePublish}>Publish Notice</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticeBoard;
