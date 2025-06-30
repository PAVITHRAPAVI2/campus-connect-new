import React, { useState, useEffect } from 'react';
import './styles/usermanage.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import BASE_URL from '../config';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/Students/students/approved`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setStudents(response.data);
        } catch (err) {
            console.error('Failed to fetch students:', err);
            setError('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            console.log('Updating:', id, status);

            // This URL path depends on your ASP.NET controller routing
            const response = await axios.put(
                `${BASE_URL}/Students/updatestatus/${id}`, // <== If this gives 404, try the line below instead:
                // `${BASE_URL}/Students/${id}/updatestatus`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            console.log('Updated:', response.data);

            // Remove the student from UI
            setStudents((prev) => prev.filter((stu) => stu.id !== id));
        } catch (err) {
            console.error(`Failed to ${status} student:`, err);
            alert(`Failed to ${status} student`);
        }
    };

    return (
        <div className="manage-students-container">
            <h2>Approved Students</h2>
            <p>List of all students approved by faculty</p>

            {loading ? (
                <p>Loading students...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : students.length === 0 ? (
                <p>No approved students found.</p>
            ) : (
                <div className="student-table">
                    <div className="table-header">
                        <span>Student Name</span>
                        <span>Student ID</span>
                        <span>Department</span>
                        <span>Role</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>

                    {students.map((student, idx) => (
                        <div className="table-row" key={idx}>
                            <div className="user-cell">
                                <div className="avatar">
                                    {(student.fullName?.slice(0, 2) || 'ST').toUpperCase()}
                                </div>
                                <div>
                                    <strong>{student.fullName || 'No Name'}</strong>
                                    <div className="email">{student.email || 'No Email'}</div>
                                </div>
                            </div>
                            <span>{student.collegeId || 'N/A'}</span>
                            <span>{student.department || 'N/A'}</span>
                            <span>{student.role || 'Student'}</span>
                            <span className={`badge ${student.status?.toLowerCase() || 'pending'}`}>
                                {student.status || 'Pending'}
                            </span>
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

export default ManageStudents;
