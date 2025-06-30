import React, { useState } from "react";
import "./noticeboard.css";
import {
    FiSearch,
    FiCalendar,
    FiEye,
    FiMessageSquare,
    FiPlus
} from "react-icons/fi";

const NoticeBoard = () => {
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingNoticeId, setEditingNoticeId] = useState(null);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState("");
    const [department, setDepartment] = useState("");
    const [content, setContent] = useState("");

    const userRole = localStorage.getItem("role"); // e.g., 'admin', 'faculty', 'student'

    const [notices, setNotices] = useState([
        {
            id: 1,
            title: "Mid-Term Examination Schedule",
            priority: "High",
            category: "Academic",
            author: "Dr. Sarah Johnson",
            date: "Mar 1, 2024, 03:30 PM",
            department: "Computer Science",
            content:
                "The mid-term examinations for all departments will commence from March 15th, 2024. Please check your respective department notice boards for detailed schedules.",
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
            content:
                "Join us for our annual technology festival featuring competitions, workshops, and guest lectures from industry experts. Registration opens March 10th.",
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
        if (userRole !== "admin") {
            alert("Only admins can delete notices.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this notice?")) {
            setNotices(notices.filter((notice) => notice.id !== id));
        }
    };

    const handleSubmit = () => {
        if (editingNoticeId) {
            // Update existing
            setNotices(notices.map((n) =>
                n.id === editingNoticeId
                    ? {
                        ...n,
                        title,
                        category,
                        priority,
                        department,
                        content
                    }
                    : n
            ));
        } else {
            // Add new
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
        }

        // Reset form
        setTitle("");
        setCategory("");
        setPriority("");
        setDepartment("");
        setContent("");
        setEditingNoticeId(null);
        setShowModal(false);
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
                </select>
            </div>

            <div className="notices-list">
                {notices.map((notice) => (
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
                            <span>
                                <FiCalendar /> {notice.date}
                            </span>
                            <span>🏫 {notice.department}</span>
                        </div>
                        <p className="notice-content">{notice.content}</p>

                        <div className="notice-footer">
                            <span><FiEye /> {notice.views} views</span>
                            <span><FiMessageSquare /> {notice.comments} comments</span>

                            {userRole === "admin" && (
                                <div className="notice-actions">
                                    <button onClick={() => handleEdit(notice)}>Edit</button>
                                    <button onClick={() => handleDelete(notice.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editingNoticeId ? "Edit Notice" : "Create New Notice"}</h3>
                            <button onClick={() => setShowModal(false)} className="close-btn">
                                &times;
                            </button>
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
                            <button className="publish-btn" onClick={handleSubmit}>
                                {editingNoticeId ? "Update Notice" : "Publish Notice"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticeBoard;
