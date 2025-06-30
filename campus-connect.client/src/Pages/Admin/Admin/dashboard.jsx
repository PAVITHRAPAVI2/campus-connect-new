import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from '../../components/dashboardlayout';
import "./dashboard.css";

const DashboardContent = () => {
    const [userName, setUserName] = useState("User");
    const [noticeCount, setNoticeCount] = useState(0);
    const [facultyCount, setFacultyCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);

    const NOTICE_API = "https://campusconnect.tryasp.net/api/Notices";
    const FACULTY_API = "https://campusconnect.tryasp.net/api/Faculties/faculties";
    const STUDENT_API = "https://campusconnect.tryasp.net/api/Students/students/approved"; // ✅ correct endpoint

    useEffect(() => {
        const name = localStorage.getItem('userName');
        if (name) setUserName(name);

        fetchNoticesCount();
        fetchFacultyCount();
        fetchStudentCount();
    }, []);

    const fetchNoticesCount = async () => {
        try {
            const res = await axios.get(NOTICE_API);
            const notices = res.data || [];

            const role = localStorage.getItem("role") || "admin";
            const count = role === "admin"
                ? notices.length
                : notices.filter(n => (n.author || "").toLowerCase() === (userName || "").toLowerCase()).length;

            setNoticeCount(count);
        } catch (err) {
            console.error("Error fetching notices:", err?.response?.data || err.message);
            setNoticeCount(0);
        }
    };

    const fetchFacultyCount = async () => {
        try {
            const res = await axios.get(FACULTY_API);
            setFacultyCount(res.data.length || 0);
        } catch (err) {
            console.error("Error fetching faculty count:", err?.response?.data || err.message);
            setFacultyCount(0);
        }
    };

    const fetchStudentCount = async () => {
        try {
            const res = await axios.get(STUDENT_API);
            const approvedStudents = res.data.filter(s => s.role?.toLowerCase() === "student");
            setStudentCount(approvedStudents.length);
        } catch (err) {
            console.error("Error fetching student count:", err?.response?.data || err.message);
            setStudentCount(0);
        }
    };

    const stats = [
        { label: "My Notices", value: noticeCount },
        { label: "Faculty", value: facultyCount },
        { label: "Students", value: studentCount },
    ];

    return (
        <div className="faculty-dashboard">
            <div className="welcome-banner">
                <h2>Welcome, {userName}!</h2>
                <p>Welcome to your dashboard. Here's what's happening in your campus community.</p>
            </div>

            <div className="stats-grid">
                {stats.map((item, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-label">{item.label}</div>
                        <div className="stat-value">{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Dashboard = () => {
    return (
        <DashboardLayout>
            <DashboardContent />
        </DashboardLayout>
    );
};

export default Dashboard;
