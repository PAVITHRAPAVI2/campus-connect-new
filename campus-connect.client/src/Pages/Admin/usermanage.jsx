import React, { useState, useEffect } from 'react';
import './usermanage.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import DashboardLayout from '../../components/dashboardlayout';

const ManageStudents = () => {
    const [search, setSearch] = useState('');
    const [selectedDept, setSelectedDept] = useState('All Departments');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://campusconnect.tryasp.net/api/Students/students/approved')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    const studentUsers = res.data.filter(user =>
                        user.role?.toLowerCase().trim() === 'student'
                    );
                    setStudents(studentUsers);
                } else {
                    console.warn('Unexpected response format:', res.data);
                    setStudents([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch students:', err);
                setLoading(false);
            });
    }, []);

    // 🧠 Combined filter: search + department
    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name?.toLowerCase().includes(search.toLowerCase()) ||
            student.email?.toLowerCase().includes(search.toLowerCase());

        const matchesDepartment =
            selectedDept === 'All Departments' || student.department === selectedDept;

        return matchesSearch && matchesDepartment;
    });

    return (
        <DashboardLayout>
            <div className="manage-students-container">
                <h2>Manage Students</h2>
                <p>View and manage all student users</p>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="🔍 Search by name or ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                    >
                        <option>All Departments</option>
                        <option>Computer Science</option>
                        <option>Chemistry</option>
                        <option>Maths</option>
                        <option>Physics</option>
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
                                        {student.initials || student.name?.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <strong>{student.name}</strong>
                                        <div className="email">{student.email}</div>
                                    </div>
                                </div>
                                <span>{student.department || 'N/A'}</span>
                                <span className={`badge ${student.status?.toLowerCase()}`}>{student.status || 'N/A'}</span>
                                <span>{student.joinDate || 'N/A'}</span>
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
