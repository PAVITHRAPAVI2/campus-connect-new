import React, { useState, useEffect } from "react";
import axios from "axios";
import "./noticeboard.css";
import {
    FiCalendar,
    FiEye,
    FiMessageSquare,
    FiPlus
} from "react-icons/fi";
import DashboardLayout from "../../components/dashboardlayout";

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
    const [notices, setNotices] = useState([]);

    const API_BASE = "https://campusconnect.tryasp.net/api/Notices";

    useEffect(() => {
        const role = localStorage.getItem("role") || "admin";
        setUserRole(role);
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const res = await axios.get(API_BASE);
            setNotices(res.data);
        } catch (err) {
            console.error("Error fetching notices:", err);
        }
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(""), 3000);
    };

    const handleEdit = (notice) => {
        setTitle(notice.title);
        setCategory(notice.category);
        setPriority(notice.priority);
        setDepartment(notice.department);
        setContent(notice.content);
        setEditingNoticeId(notice.id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this notice?")) {
            try {
                await axios.delete(`${API_BASE}/${id}`);
                setNotices(notices.filter((n) => n.id !== id));
                showToast("Notice deleted successfully!");
            } catch (err) {
                console.error("Delete error:", err);
                showToast("Failed to delete notice");
            }
        }
    };

    const handleSubmit = async () => {
        const noticeData = {
            title: title.trim(),
            category: category.trim(),
            priority: priority.trim(),
            department: department.trim(),
            content: content.trim(),
            author: "System",
            date: new Date().toISOString(),
            views: 0,
            comments: 0,
            pin: false
        };

        // validation
        for (let key in noticeData) {
            if (noticeData[key] === "") {
                showToast(`Field "${key}" is required`);
                return;
            }
        }

        try {
            if (editingNoticeId) {
                // PUT
                await axios.put(`${API_BASE}/${editingNoticeId}`, {
                    ...noticeData,
                    id: editingNoticeId
                });
                showToast("Notice updated successfully!");
            } else {
                // POST
                await axios.post(API_BASE, noticeData);
                showToast("Notice posted successfully!");
            }

            clearForm();
            fetchNotices();
        } catch (error) {
            console.error("Failed to save notice", error);
            showToast("Failed to save notice");
        }
    };

    const clearForm = () => {
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
                                </div>

                                <h3>{notice.title}</h3>
                                <div className="notice-meta">
                                    <span><FiCalendar /> {new Date(notice.date).toLocaleString()}</span>
                                    <span>🏫 {notice.department}</span>
                                </div>

                                <p className="notice-content">{notice.content}</p>

                                <div className="notice-footer">
                                    <div className="notice-actions">
                                        <span><FiEye /> {notice.views || 0}</span>
                                        <span><FiMessageSquare /> {notice.comments || 0}</span>

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
                                placeholder="Priority (High/Medium/Low)"
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
                                <button onClick={clearForm}>Cancel</button>
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