import React from "react";
import DashboardLayout from '../../components/dashboardlayout';
import "./dashboard.css";

const DashboardContent = () => {
    const stats = [
        { label: "My Notices", value: 12 },
        { label: "Student Approvals", value: 3 },
        //{ label: "Total Views", value: 156, color: "green" }
    ];

    const activities = [
        { message: "3 student approvals pending", time: "1 hour ago" },
        { message: "New comment on your notice", time: "3 hours ago" },
        { message: "Message in Computer Science group", time: "5 hours ago" },
        { message: "Your notice has 25 new views", time: "1 day ago" }
    ];

    return (
        <div className="faculty-dashboard">
            <div className="welcome-banner">
                <h2>Good afternoon, Dr. Sarah!</h2>
                <p>Welcome to your faculty dashboard. Here's what's happening in your campus community.</p>
            </div>

            <div className="stats-grid">
                {stats.map((item, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-label">{item.label}</div>
                        <div className={`stat-value ${item.color || ""}`}>{item.value}</div>
                    </div>
                ))}
            </div>

            <div className="recent-activity">
                <h3>Recent Activity</h3>
                <ul>
                    {activities.map((activity, index) => (
                        <li key={index} className="activity-item">
                            <span>{activity.message}</span>
                            <span className="time">{activity.time}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// This is the actual component that you will use in your router
const Dashboard = () => {
    return (
        <DashboardLayout>
            <DashboardContent />
        </DashboardLayout>
    );
};

export default Dashboard;
