import React from 'react';

import '../styles/Facultydashboard.css';
import DashboardLayout from '../../components/DashboardLayout';

const FacultyDashboard = () => {
    return (
        <DashboardLayout>
            {/* This content will go inside <main class="main-content"> */}
            <section className="welcome-banner">
                <h1>Good afternoon, sathiyapriya!</h1>
                <p>Welcome to your faculty dashboard. Here's what's happening in your campus community.</p>
            </section>

            <section className="cards-row">
                <div className="card blue">
                    <p>My Notices</p>
                    <h2>12</h2>
                </div>
                <div className="card orange">
                    <p>Student Approvals</p>
                    <h2>3</h2>
                </div>
                <div className="card purple">
                    <p>Group Chats</p>
                    <h2>5</h2>
                </div>
                <div className="card green">
                    <p>Total Views</p>
                    <h2>156</h2>
                </div>
            </section>

            <section className="recent-activity">
                <h3>Recent Activity</h3>
                <ul>
                    <li>3 student approvals pending <span>1 hour ago</span></li>
                    <li>New comment on your notice <span>3 hours ago</span></li>
                    <li>Message in Computer Science group <span>5 hours ago</span></li>
                    <li>Your notice has 25 new views <span>1 day ago</span></li>
                </ul>
            </section>
        </DashboardLayout>
    );
};

export default FacultyDashboard;
