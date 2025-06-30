import React, { useState, useEffect } from 'react';
import './styles/usermanage.css';
import axios from 'axios';
import BASE_URL from '../config';

// Decode JWT token
function decodeToken(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error('Token decoding failed:', err);
        return null;
    }
}

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchApprovedStudents();
    }, []);

    const fetchApprovedStudents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const decoded = decodeToken(token);
            const facultyDept = decoded?.department || decoded?.Department;

            const response = await axios.get(`${BASE_URL}/Students/students/approved`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Filter only students in the same department as the faculty
            const departmentStudents = response.data.filter(
                (student) => student.department?.toLowerCase() === facultyDept?.toLowerCase()
            );

            setStudents(departmentStudents);
        } catch (err) {
            console.error('Failed to fetch students:', err);
            setError('Failed to load students.');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter((student) => {
        const name = student.fullName?.toLowerCase() || '';
        const email = student.email?.toLowerCase() || '';
        return (
            name.includes(searchTerm.toLowerCase()) ||
            email.includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="manage-students-container">
            <h2>Manage Approved Students</h2>
            <p>Viewing only students from your department.</p>

            <input
                type="text"
                className="search-input"
                placeholder="🔍 Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading ? (
                <p>Loading students...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : filteredStudents.length === 0 ? (
                <p>No approved students found in your department.</p>
            ) : (
                <div className="student-table">
                    <div className="table-header">
                        <span>Student Name</span>
                        <span>College ID</span>
                        <span>Department</span>
                        <span>Role</span>
                    </div>

                    {filteredStudents.map((student, idx) => {
                        const fullName = student.fullName || 'No Name';
                        const initials = fullName.slice(0, 2).toUpperCase();
                        const email = student.email || 'No Email';
                        const collegeId = student.collegeId || student.registrationNumber || 'N/A';
                        const department = student.department || 'N/A';
                        const role = student.role || 'Student';

                        return (
                            <div className="table-row" key={idx}>
                                <div className="user-cell">
                                    <div className="avatar">{initials}</div>
                                    <div>
                                        <strong>{fullName}</strong>
                                        <div className="email">{email}</div>
                                    </div>
                                </div>
                                <span>{collegeId}</span>
                                <span>{department}</span>
                                <span>{role}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ManageStudents;
