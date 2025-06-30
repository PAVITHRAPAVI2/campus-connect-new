import React, { useEffect, useState } from 'react';
import './usermanage.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import DashboardLayout from '../../components/dashboardlayout';

const StudentApproval = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://localhost:7144/api/User')
            .then((res) => {
                const pendingStudents = res.data.filter(
                    (user) => user.role === 'Student' && user.status === 'Pending'
                );
                setStudents(pendingStudents);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching students:', err);
                setLoading(false);
            });
    }, []);

    const updateStatus = (userId, newStatus) => {
        axios.put(`https://localhost:7144/api/User/${userId}/status`, { status: newStatus })
            .then(() => {
                setStudents(prev => prev.filter(u => u.id !== userId));
            })
            .catch((err) => {
                console.error('Failed to update status:', err);
            });
    };

    return (
       
        <div className="user-management-container">
            <DashboardLayout/>
            <h2>Student Approvals</h2>
            <p>Approve or reject new student accounts</p>

            {loading ? (
                <p>Loading pending students...</p>
            ) : students.length === 0 ? (
                <p>No pending student approvals.</p>
            ) : (
                <div className="user-table">
                    <div className="table-header">
                        <span>User</span>
                        <span>College ID</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>

                    {students.map((student) => (
                        <div className="table-row" key={student.id}>
                            <div className="user-cell">
                                <div className="avatar">
                                    {student.initials || student.name?.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <strong>{student.name}</strong>
                                </div>
                            </div>
                            <span>{student.email}</span>
                            <span>{student.collegeId || 'N/A'}</span>
                            <span>{student.department}</span>
                            <span className={`badge ${student.status.toLowerCase()}`}>{student.status}</span>
                            <span>{student.joinDate}</span>
                            <span className="actions">
                                <FaCheckCircle
                                    className="approve-icon"
                                    title="Approve"
                                    onClick={() => updateStatus(student.id, 'Approved')}
                                />
                                <FaTimesCircle
                                    className="reject-icon"
                                    title="Reject"
                                    onClick={() => updateStatus(student.id, 'Rejected')}
                                />
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentApproval;
