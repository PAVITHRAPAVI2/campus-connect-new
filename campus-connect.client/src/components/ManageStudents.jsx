// src/components/ManageStudents.jsx
import React, { useState, useEffect } from 'react';
import './styles/usermanage.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import BASE_URL from '../config'; //nsure this is correctly pointing to your base URL file

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${BASE_URL}/`)
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

    return (
        <div className="manage-students-container">
            <h2>Manage Students</h2>
            <p>View and manage all student users</p>

            {loading ? (
                <p>Loading students...</p>
            ) : (
                <div className="student-table">
                    <div className="table-header">
                        <span>Student Name</span>
                        <span>Student ID</span>
                        <span>Department</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>

                    {students.map((student, idx) => (
                        <div className="table-row" key={idx}>
                            <div className="user-cell">
                                <div className="avatar">
                                    {(student.name?.slice(0, 2) || 'ST').toUpperCase()}
                                </div>
                                <div>
                                    <strong>{student.name}</strong>
                                    <div className="email">{student.email}</div>
                                </div>
                            </div>
                            <span>{student.collegeId || 'N/A'}</span>
                            <span>{student.department || 'N/A'}</span>
                            <span className={`badge ${student.status?.toLowerCase() || 'pending'}`}>
                                {student.status || 'Pending'}
                            </span>
                            <span className="actions">
                                <FaCheckCircle className="approve-icon" title="Approve" />
                                <FaTimesCircle className="reject-icon" title="Reject" />
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageStudents;
