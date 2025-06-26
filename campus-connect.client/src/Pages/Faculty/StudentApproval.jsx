import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import '../styles/StudentApproval.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentApprovalContent = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPendingStudents();
    }, []);

    const fetchPendingStudents = async () => {
        try {
            const response = await axios.get('/api/faculty/pending-students');
            setStudents(response.data);
        } catch (error) {
            toast.error("Failed to load pending students.");
            console.error(error);
        }
    };

    const approveStudent = async (studentId) => {
        try {
            await axios.put(`/api/faculty/approve-student/${studentId}`);
            toast.success("Student approved successfully.");
            setStudents((prev) => prev.filter((s) => s.id !== studentId));
        } catch (error) {
            toast.error("Approval failed.");
            console.error(error);
        }
    };

    const filtered = students.filter((s) =>
        s.fullName.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="approval-container">
            <ToastContainer position="top-center" autoClose={3000} />

            <h2>Pending Student Approvals</h2>
            <p className="subtitle">Students awaiting approval from your department</p>

            <div className="filters">
                <input
                    type="text"
                    placeholder="🔍 Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <table className="approval-table">
                <thead>
                    <tr>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>COLLEGE ID</th>
                        <th>BATCH</th>
                        <th>DEPARTMENT</th>
                        <th>JOINED</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
                                No students to approve.
                            </td>
                        </tr>
                    ) : (
                        filtered.map((student) => (
                            <tr key={student.id}>
                                <td>{student.fullName}</td>
                                <td>{student.email}</td>
                                <td>{student.collegeId}</td>
                                <td>{student.batch}</td>
                                <td>{student.department}</td>
                                <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn approve"
                                        onClick={() => approveStudent(student.id)}
                                    >
                                        Approve
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

const StudentApproval = () => (
    <DashboardLayout>
        <StudentApprovalContent />
    </DashboardLayout>
);

export default StudentApproval;
