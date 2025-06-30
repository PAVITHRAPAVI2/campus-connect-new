import React, { useState, useEffect } from 'react';
import './usermanage.css'; // Reuse the same CSS
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import DashboardLayout from '../../components/dashboardlayout';

const ManageFaculty = () => {
    const [search, setSearch] = useState('');
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://localhost:7144/api/User')
            .then((res) => {
                const facultyUsers = res.data.filter(user => user.role === 'Faculty');
                setFaculty(facultyUsers);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch faculty:', err);
                setLoading(false);
            });
    }, []);

    const filteredFaculty = faculty.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="manage-students-container">
                <h2>Manage Faculty</h2>
                <p>View and manage all faculty users</p>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="🔍 Search by name or email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select>
                        <option>All Departments</option>
                        <option>CSE</option>
                        <option>ECE</option>
                        <option>IT</option>
                        <option>EEE</option>
                    </select>
                    <select>
                        <option>All Status</option>
                        <option>Approved</option>
                        <option>Pending</option>
                    </select>
                </div>

                {loading ? (
                    <p>Loading faculty...</p>
                ) : (
                    <div className="student-table">
                        <div className="table-header">
                            <span>Faculty</span>
                            <span>Faculty ID</span>
                            <span>Department</span>
                            <span>Status</span>
                            <span>Actions</span>
                        </div>

                        {filteredFaculty.map((user, idx) => (
                            <div className="table-row" key={idx}>
                                <div className="user-cell">
                                    <div className="avatar">
                                        {user.initials || user.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <strong>{user.name}</strong>
                                        <div className="email">{user.email}</div>
                                    </div>
                                </div>
                                <span>{user.department}</span>
                                <span className={`badge ${user.status?.toLowerCase()}`}>{user.status}</span>
                                <span>{user.joinDate}</span>
                                <span className="actions">
                                    <FaCheckCircle className="approve-icon" />
                                    <FaTimesCircle className="reject-icon" />
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageFaculty;
