import React, { useState, useEffect } from "react";
import "./noticeboard.css";
import {
    FiCalendar,
    FiEye,
    FiMessageSquare,
    FiPlus
} from "react-icons/fi";
import DashboardLayout from '../../components/dashboardlayout';

const NoticeBoard = () => {
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingNoticeId, setEditingNoticeId] = useState(null);
    const [toast, setToast] = useState("");

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState("");
    const [department, setDepartment] = useState("");
    const [content, setContent] = useState("");

    const [userRole, setUserRole] = useState("student");

    useEffect(() => {
        const role = localStorage.getItem("role") || "admin";
        setUserRole(role);
    }, []);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(""), 3000);
    };

    const [notices, setNotices] = useState([
        {
            id: 1,
            title: "Mid-Term Examination Schedule",
            priority: "High",
            category: "Academic",
            author: "Dr. Sarah Johnson",
            date: "Mar 1, 2024, 03:30 PM",
            department: "Computer Science",
            content: "Mid-term exams begin March 15th. Check your department board.",
            views: 156,
            comments: 0,
            pin: true
        },
        {
            id: 2,
            title: "Annual Tech Fest - InnovateTech 2024",
            priority: "Medium",
            category: "Event",
            author: "System Administrator",
            date: "Feb 28, 2024, 08:00 PM",
            department: "IT Administration",
            content: "Join our tech festival! Registration opens March 10th.",
            views: 120,
            comments: 2
        }
    ]);

    const handleEdit = (notice) => {
        setTitle(notice.title);
        setCategory(notice.category);
        setPriority(notice.priority);
        setDepartment(notice.department);
        setContent(notice.content);
        setEditingNoticeId(notice.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this notice?")) {
            setNotices(notices.filter((notice) => notice.id !== id));
            showToast("Notice deleted successfully!");
        }
    };

    const handleSubmit = () => {
        if (editingNoticeId) {
            setNotices(notices.map((n) =>
                n.id === editingNoticeId
                    ? { ...n, title, category, priority, department, content }
                    : n
            ));
            showToast("Notice updated successfully!");
        } else {
            const newNotice = {
                id: Date.now(),
                title,
                category,
                priority,
                department,
                content,
                date: new Date().toLocaleString(),
                author: "You",
                views: 0,
                comments: 0
            };
            setNotices([...notices, newNotice]);
            showToast("Notice posted successfully!");
        }

        setTitle("");
        setCategory("");
        setPriority("");
        setDepartment("");
        setContent("");
        setEditingNoticeId(null);
        setShowModal(false);
    };

    return (
        <DashboardLayout>
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
                    </select>
                </div>

                <div className="notices-list">
                    {notices
                        .filter((notice) =>
                            notice.title.toLowerCase().includes(search.toLowerCase()) ||
                            notice.content.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((notice) => (
                            <div key={notice.id} className="notice-card">
                                <div className="notice-tags">
                                    <span className={`tag ${notice.priority.toLowerCase()}`}>
                                        {notice.priority} Priority
                                    </span>
                                    <span className="tag category">{notice.category}</span>
                                    {notice.pin && <span className="pin">📌</span>}
                                </div>

                                <h3>{notice.title}</h3>
                                <div className="notice-meta">
                                    <span>👤 {notice.author}</span>
                                    <span><FiCalendar /> {notice.date}</span>
                                    <span>🏫 {notice.department}</span>
                                </div>

                                <p className="notice-content">{notice.content}</p>

                                <div className="notice-footer">
                                    <div className="notice-actions">
                                        <span><FiEye /> {notice.views}</span>
                                        <span><FiMessageSquare /> {notice.comments}</span>

                                        {(userRole === "admin" || userRole === "faculty") && (
                                            <div className="edit-delete-buttons">
                                                <button className="edit-btn" onClick={() => handleEdit(notice)}>✏️ Edit</button>
                                                {userRole === "admin" && (
                                                    <button className="delete-btn" onClick={() => handleDelete(notice.id)}>🗑️ Delete</button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>{editingNoticeId ? "Edit Notice" : "Create Notice"}</h3>
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            />
                            <textarea
                                placeholder="Content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            ></textarea>

                            <div className="modal-actions">
                                <button onClick={handleSubmit}>
                                    {editingNoticeId ? "Update" : "Post"}
                                </button>
                                <button onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {toast && <div className="toast">{toast}</div>}
            </div>
        </DashboardLayout>
    );
};

export default NoticeBoard;
