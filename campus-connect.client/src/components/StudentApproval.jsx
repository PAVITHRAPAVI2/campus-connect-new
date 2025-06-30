import React, { useState, useEffect } from 'react';
import './styles/StudentApproval.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import BASE_URL from "../config";

const StudentApproval = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [statusFilter, setStatusFilter] = useState('All Status');

    useEffect(() => {
        fetchStudents();
    }, [statusFilter]);

    const fetchStudents = async () => {
        try {
            let url = '';

            if (statusFilter === 'Approved') {
                url = `${BASE_URL}/Students/students/approved`;
            } else if (statusFilter === 'Pending') {
                url = `${BASE_URL}/Students/students/pending`;
            } else {
                const approved = await axios.get(`${BASE_URL}/Students/students/approved`);
                const pending = await axios.get(`${BASE_URL}/Students/students/pending`);
                setStudents([...pending.data, ...approved.data]);
                return;
            }

            const response = await axios.get(url);
            setStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'ST';
        return name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.put(`${BASE_URL}/Students/students/${id}`, {
                status: newStatus
            });
            fetchStudents();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const filteredStudents = students.filter((student) => {
        const name = student?.name?.toLowerCase() || '';
        const email = student?.email?.toLowerCase() || '';
        const matchSearch = name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
        const matchRole = roleFilter === 'All Roles' || student.role === roleFilter;
        const matchStatus = statusFilter === 'All Status' || student.status === statusFilter;
        return matchSearch && matchRole && matchStatus;
    });

    return (
        <div className="approval-container">
            <h2>Student Approval Management</h2>
            <p className="subtitle">Manage all users in the system</p>

            <div className="filters">
                <input
                    type="text"
                    placeholder="🔍 Search Users"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                    <option>All Roles</option>
                    <option>Student</option>
                    <option>Faculty</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option>All Status</option>
                    <option>Approved</option>
                    <option>Pending</option>
                </select>
            </div>

            <table className="approval-table">
                <thead>
                    <tr>
                        <th>USER</th>
                        <th>ROLE</th>
                        <th>DEPARTMENT</th>
                        <th>STATUS</th>
                        <th>JOIN DATE</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map((student) => (
                        <tr key={student.id}>
                            <td>
                                <div className="user-info">
                                    <div className="avatar">{getInitials(student.name)}</div>
                                    <div>
                                        <div className="name">{student.name || 'No Name'}</div>
                                        <div className="email">{student.email || 'No Email'}</div>
                                    </div>
                                </div>
                            </td>
                            <td>{student.role || 'N/A'}</td>
                            <td>{student.department || 'N/A'}</td>
                            <td className={`status ${student.status?.toLowerCase() || 'unknown'}`}>
                                {student.status || 'Unknown'}
                            </td>
                            <td>{student.joinDate?.slice(0, 10) || 'N/A'}</td>
                            <td>
                                {student.status === 'Pending' ? (
                                    <div className="icon-buttons">
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
                                    </div>
                                ) : (
                                    <span>{student.status}</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentApproval;
