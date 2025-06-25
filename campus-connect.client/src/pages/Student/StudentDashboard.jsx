import React, { useContext } from 'react';
import { FaUserGraduate, FaComments, FaChartLine } from 'react-icons/fa';
import { AuthContext } from '../../AuthContext.jsx';
import UserProfile from '../../components/Styless/UserProfile';
import '../../pages/Student/student style/StudentDashboard.css';

function StudentDashboard() {
    const { user } = useContext(AuthContext);

    // While user is still null, you can show a spinner or return null
    if (!user) return null;

    return (
        <div className="main-center">
            {/* Greeting */}
            <section className="greeting">
                <h2>Hello, {user.name.split(' ')[0]}!</h2>
                <p>Welcome to your dashboard.</p>
            </section>

            {/* Stats */}
            <section className="stats-grid">
                <div className="stat-card orange">
                    <FaUserGraduate size={24} />
                    <div><p>Completed Credits</p><h3>21</h3></div>
                </div>
                <div className="stat-card purple">
                    <FaComments size={24} />
                    <div><p>Group Chats</p><h3>3</h3></div>
                </div>
                <div className="stat-card green">
                    <FaChartLine size={24} />
                    <div><p>Performance</p><h3>87%</h3></div>
                </div>
            </section>

            {/* Recent activity */}
            <section className="recent-activity">
                <h3>Recent Activity</h3>
                <ul>
                    <li>📝 New assignment posted in DBMS</li>
                    <li>📢 Notice about upcoming exams</li>
                    {/* … */}
                </ul>
            </section>

            {/* Profile preview */}
            <section className="profile-preview">
                <h3>Your Profile</h3>
                <UserProfile user={user} />
            </section>
        </div>
    );
}

export default StudentDashboard;