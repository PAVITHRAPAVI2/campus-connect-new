import React, { useEffect, useState } from 'react';
import '../styles/Facultydashboard.css';
import DashboardLayout from '../../components/DashboardLayout';
import BASE_URL from '../../config';

const FacultyDashboard = () => {
    const [noticesCount, setNoticesCount] = useState(0);
    const [pendingApprovals, setPendingApprovals] = useState(0);
    const [groupChatsCount, setGroupChatsCount] = useState(0);
    const [totalViews, setTotalViews] = useState(0);
    const [activities, setActivities] = useState([]);

    const faculty = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!faculty) return;

        const fetchData = async () => {
            try {
                const resNotices = await fetch(`${BASE_URL}/Notices`);
                const notices = await resNotices.json();
                setNoticesCount(notices.length);

                const resApprovals = await fetch(`/api/students/pending`);
                const approvals = await resApprovals.json();
                setPendingApprovals(approvals.length);

                // Fetch Department Group Chat messages
                const resChats = await fetch(`/api/chat/department/${faculty.department}`);
                const chatMessages = await resChats.json();
                setGroupChatsCount(chatMessages.length);

                // Fetch Total Notice Views
                const resViews = await fetch(`/api/notices/views/${faculty.id}`);
                const viewData = await resViews.json();
                setTotalViews(viewData.totalViews || 0);

                // Fetch Recent Activities
                const resActivity = await fetch(`/api/faculty/activity/${faculty.id}`);
                const activityData = await resActivity.json();
                setActivities(activityData);

            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            }
        };

        fetchData();
    }, [faculty]);

    return (
        <DashboardLayout>
            <section className="welcome-banner">
                <h1>Good afternoon, {faculty?.name || 'Faculty'}!</h1>
                <p>Welcome to your faculty dashboard. Here's what's happening in your campus community.</p>
            </section>

            <section className="cards-row">
                <div className="card blue">
                    <p>My Notices</p>
                    <h2>{noticesCount}</h2>
                </div>
                <div className="card orange">
                    <p>Student Approvals</p>
                    <h2>{pendingApprovals}</h2>
                </div>
                <div className="card purple">
                    <p>Group Chats</p>
                    <h2>{groupChatsCount}</h2>
                </div>
                <div className="card green">
                    <p>Total Views</p>
                    <h2>{totalViews}</h2>
                </div>
            </section>

            <section className="recent-activity">
                <h3>Recent Activity</h3>
                <ul>
                    {activities.length === 0 ? (
                        <li>No recent activity</li>
                    ) : (
                        activities.map((item, idx) => (
                            <li key={idx}>
                                {item.text} <span>{item.time}</span>
                            </li>
                        ))
                    )}
                </ul>
            </section>
        </DashboardLayout>
    );
};

export default FacultyDashboard;
