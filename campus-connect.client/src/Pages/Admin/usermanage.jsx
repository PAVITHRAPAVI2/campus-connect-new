import React, { useState, useEffect } from 'react';
import './usermanage.css'; // Rename the CSS file too
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import DashboardLayout from '../../components/dashboardlayout';

const ManageStudents = () => {
    const [search, setSearch] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://localhost:7144/api/User')
            .then((res) => {
                const studentUsers = res.data.filter(user => user.role === 'Student');
                setStudents(studentUsers);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch students:', err);
                setLoading(false);
            });
    }, []);

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(search.toLowerCase()) ||
            student.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="manage-students-container">
                <h2>Manage Students</h2>
                <p>View and manage all student users</p>

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
                    <p>Loading students...</p>
                ) : (
                    <div className="student-table">
                        <div className="table-header">
                            <span>Student</span>
                            <span>Student ID</span>
                            <span>Department</span>
                            <span>Status</span>
                            <span>Actions</span>
                        </div>

                        {filteredStudents.map((student, idx) => (
                            <div className="table-row" key={idx}>
                                <div className="user-cell">
                                    <div className="avatar">
                                        {student.initials || student.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <strong>{student.name}</strong>
                                        <div className="email">{student.email}</div>
                                    </div>
                                </div>
                                <span>{student.department}</span>
                                <span className={`badge ${student.status?.toLowerCase()}`}>{student.status}</span>
                                <span>{student.joinDate}</span>
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

export default ManageStudents;
