import React, { useState, useEffect } from 'react';
import { FaUserGraduate, FaComments, FaChartLine } from 'react-icons/fa';
import DashboardLayout from '../../components/Styless/DashboardLayout'; 
import '../../Pages/Student/student style/StudentDashboard.css';

function StudentDashboard() {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('fullName') || 'Student';
        setUserName(name);
    }, []);

    return (
        <DashboardLayout> 
            <div className="main-center">
                <section className="greeting">
                    <h2>Good afternoon, {userName}!</h2>
                    <p>Welcome to your student dashboard. Here's what's happening in your courses.</p>
                </section>

                <section className="stats-grid">
                    <div className="stat-card orange">
                        <FaUserGraduate size={24} />
                        <div>
                            <p>Events</p>
                            
                        </div>
                    </div>
                    <div className="stat-card purple">
                        <FaComments size={24} />
                        <div>
                            <p>Group Chats</p>
                            
                        </div>
                    </div>
                    <div className="stat-card green">
                        <FaChartLine size={24} />
                        <div>
                            <p>Notices</p>
                           
                        </div>
                    </div>
                </section>

                <section className="recent-activity">
                    <h3>Recent Activity</h3>
                    <ul>
                        <li>📝 New assignment posted in DBMS</li>
                        <li>📢 Notice about upcoming exams</li>
                        <li>💬 New chat message from AI Group</li>
                        <li>🎯 You scored 18/20 in OOPS quiz</li>
                    </ul>
                </section>
            </div>
        </DashboardLayout>
    );
}

export default StudentDashboard;
