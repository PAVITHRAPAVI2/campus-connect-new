
import React, { useEffect, useState } from 'react';
import '../styles/Facultydashboard.css';
import DashboardLayout from '../../components/DashboardLayout';
import BASE_URL from '../../config';

const FacultyDashboardContent = () => {
    const [noticesCount, setNoticesCount] = useState(0);
    const [pendingApprovals, setPendingApprovals] = useState(0);
    const [groupChatsCount, setGroupChatsCount] = useState(0);
    const [totalViews, setTotalViews] = useState(0);
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState('');

    const faculty = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!faculty || !token) {
            setError('Authentication failed. Please login again.');
            return;
        }

        const fetchData = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [resNotices, resApprovals, resChats, resViews, resActivity] = await Promise.all([
                    fetch(`${BASE_URL}/Notices`, { headers }),
                    fetch(`${BASE_URL}/students/pending`, { headers }),
                    fetch(`${BASE_URL}/Message/groups`, { headers }),
                    fetch(`${BASE_URL}/notices/views/${faculty.collegeId}`, { headers }),
                    fetch(`${BASE_URL}/faculty/activity/${faculty.collegeId}`, { headers }),
                ]);
                if ([resNotices, resApprovals, resChats, resViews, resActivity].some(res => res.status === 401)) {
                    setError('Unauthorized. Token may be expired.');
                    return;
                }

                const notices = await resNotices.json();
                const approvals = await resApprovals.json();
                const chatGroups = await resChats.json();
                const viewsData = await resViews.json();
                const activityData = await resActivity.json();

                setNoticesCount(notices?.length || 0);
                setPendingApprovals(approvals?.length || 0);

                const deptChats = chatGroups?.filter(
                    g => g.department === faculty.department && !g.isCommon
                ) || [];
                setGroupChatsCount(deptChats.length);

                setTotalViews(viewsData?.totalViews || 0);
                setActivities(activityData || []);
            } catch (err) {
                console.error('🔴 Error loading dashboard:', err);
                setError('Failed to load dashboard data. Please try again later.');
            }
        };

        fetchData();
    }, [faculty, token]);

    return (
      <div>
            <section className="welcome-banner">
                <h1>Welcome, {faculty?.name || 'Faculty'}!</h1>
                <p>Here’s your campus overview:</p>
            </section>

            {error && (
                <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

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
        </div>
    );
};

const FacultyDashboard = () => {
    return (
        <DashboardLayout>
            <FacultyDashboardContent />
        </DashboardLayout>
    );
};

export default FacultyDashboard;
