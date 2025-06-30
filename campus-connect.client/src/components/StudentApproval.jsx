/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './styles/usermanage.css';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import BASE_URL from '../config';

// Helper to decode JWT and extract faculty department
function decodeToken(token) {
    try {
        const payload = token.split('.')[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(base64));
        return decoded.department || decoded.Department || '';
    } catch (err) {
        console.error('Error decoding token:', err);
        return '';
    }
}

const StudentApproval = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [department, setDepartment] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const dept = decodeToken(token);
        setDepartment(dept);
        if (dept) fetchPendingStudents(dept);
    }, []);

    const fetchPendingStudents = async (dept) => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/Students/students/pending/${dept}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setStudents(res.data);
        } catch (err) {
            console.error('Error fetching students:', err);
            setError('Failed to load students.');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${BASE_URL}/Faculties/approve-student/${id}`, { status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // Refresh list after update
            fetchPendingStudents(department);
        } catch (err) {
            console.error('Failed to update student status:', err);
            alert('Failed to update status. Please try again.');
        }
    };

    return (
        <div className="manage-students-container">
            <h2>Student Approvals - {department}</h2>
            <p>Only pending students from your department are shown.</p>

            {loading ? (
                <p>Loading students...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : students.length === 0 ? (
                <p>No pending students found.</p>
            ) : (
                <div className="student-table">
                    <div className="table-header">
                        <span>Name</span>
                        <span>College ID</span>
                        <span>Email</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>

                    {students.map((student) => (
                        <div className="table-row" key={student.id}>
                            <div className="user-cell">
                                <div className="avatar">
                                    {(student.fullName || 'ST').slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <strong>{student.fullName || 'No Name'}</strong>
                                    <div className="email">{student.email || 'No Email'}</div>
                                </div>
                            </div>
                            <span>{student.collegeId || student.registrationNumber || 'N/A'}</span>
                            <span>{student.email || 'N/A'}</span>
                            <span className={`status ${student.status?.toLowerCase() || 'pending'}`}>
                                {student.status || 'Pending'}
                            </span>
                            <span className="icon-buttons">
                                <FaCheckCircle
                                    className="icon approve"
                                    title="Approve"
                                    onClick={() => updateStatus(student.id, 'Approved')}
                                />
                                <FaTimesCircle
                                    className="icon reject"
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
