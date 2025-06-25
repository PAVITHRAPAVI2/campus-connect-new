import React, { useState, useEffect } from 'react';
import './styles/StudentApproval.css';

const dummyStudents = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john.student@university.edu',
        role: 'Student',
        department: 'Computer Science',
        status: 'Approved',
        joinDate: '2024-01-15',
    },
    {
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@university.edu',
        role: 'Student',
        department: 'IT',
        status: 'Pending',
        joinDate: '2024-03-01',
    },
    {
        id: 3,
        name: 'Ravi Kumar',
        email: 'ravi.kumar@university.edu',
        role: 'Student',
        department: 'ECE',
        status: 'Pending',
        joinDate: '2024-04-10',
    },
];

const StudentApproval = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [statusFilter, setStatusFilter] = useState('All Status');

    useEffect(() => {
        setStudents(dummyStudents); // Replace with API call in real app
    }, []);

    const getInitials = (name) => {
        return name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const updateStatus = (id, newStatus) => {
        const updated = students.map((student) =>
            student.id === id ? { ...student, status: newStatus } : student
        );
        setStudents(updated);
    };

    const filteredStudents = students.filter((student) => {
        const matchSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());

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
                    <option>Rejected</option>
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
                                        <div className="name">{student.name}</div>
                                        <div className="email">{student.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td>{student.role}</td>
                            <td>{student.department}</td>
                            <td className={`status ${student.status.toLowerCase()}`}>{student.status}</td>
                            <td>{student.joinDate}</td>
                            <td>
                                {student.status === 'Pending' ? (
                                    <>
                                        <button
                                            className="btn approve"
                                            onClick={() => updateStatus(student.id, 'Approved')}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn reject"
                                            onClick={() => updateStatus(student.id, 'Rejected')}
                                        >
                                            Reject
                                        </button>
                                    </>
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
