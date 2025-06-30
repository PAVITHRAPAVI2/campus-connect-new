import React, { useState, useEffect } from 'react';
import './usermanage.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import DashboardLayout from '../../components/dashboardlayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState('All Departments');
    const [loading, setLoading] = useState(true);
    const [editingStudent, setEditingStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get('https://campusconnect.tryasp.net/api/Students/students/approved');
            setStudents(res.data || []);
        } catch (error) {
            console.error('Failed to fetch students:', error);
            toast.error('❌ Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (student) => {
        setEditingStudent({
            id: student.id,
            fullName: student.fullName || '',
            email: student.email || '',
            department: student.department || '',
            batch: student.batch || '',
            avatar: student.avatar || '' // Required by backend
        });
        setShowModal(true);
    };

    const handleUpdate = async () => {
        try {
            const { id, fullName, email, department, batch, avatar } = editingStudent;

            const payload = {
                fullName: fullName.trim(),
                email: email.trim(),
                department: department.trim(),
                batch: batch.trim(),
                avatar: avatar.trim()
            };

            await axios.put(`https://campusconnect.tryasp.net/api/Students/students/${id}`, payload);

            toast.success(' Student updated successfully!');
            setShowModal(false);
            fetchStudents();
        } catch (error) {
            console.error('Failed to update student:', error.response?.data || error);
            const errors = error.response?.data?.errors;
            if (errors) {
                const msg = Object.values(errors).flat().join(', ');
                toast.error(`❌ ${msg}`);
            } else {
                toast.error('❌ Update failed!');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://campusconnect.tryasp.net/api/Students/students/${id}`);
            toast.success('🗑️ Student permanently deleted!');
            fetchStudents();
        } catch (err) {
            console.error('Delete failed', err);
            toast.error('❌ Delete failed!');
        }
    };

    const getInitials = (name) => {
        if (!name) return 'NA';
        const parts = name.split(' ');
        return parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : name[0].toUpperCase();
    };

    const filtered = students.filter(s =>
        (s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            s.collegeId?.toLowerCase().includes(search.toLowerCase())) &&
        (department === 'All Departments' || s.department === department)
    );

    return (
        <DashboardLayout>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="manage-students-container">
                <h2>Manage Students</h2>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="🔍 Search by name or ID"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select value={department} onChange={e => setDepartment(e.target.value)}>
                        <option>All Departments</option>
                        <option>Computer Science</option>
                        <option>Maths</option>
                        <option>Chemistry</option>
                        <option>Physics</option>
                    </select>
                </div>

                {loading ? (
                    <p>Loading students...</p>
                ) : (
                    <div className="student-table">
                        <div className="table-header">
                            <span>Student</span>
                            <span>ID</span>
                            <span>Dept</span>
                            <span>Status</span>
                            <span>Actions</span>
                        </div>
                        {filtered.map((student, idx) => (
                            <div className="table-row" key={idx}>
                                <div className="user-cell">
                                    <div className="avatar">{getInitials(student.fullName)}</div>
                                    <div>
                                        <strong>{student.fullName}</strong>
                                        <div className="email">{student.email}</div>
                                    </div>
                                </div>
                                <div>{student.collegeId}</div>
                                <div>{student.department}</div>
                                <div>{student.isApproved ? 'Approved' : 'Pending'}</div>
                                <div>
                                    <FaEdit
                                        onClick={() => handleEdit(student)}
                                        style={{ color: 'green', cursor: 'pointer', marginRight: '10px' }}
                                    />
                                    <FaTrash
                                        onClick={() => handleDelete(student.id)}
                                        style={{ color: 'red', cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Modal */}
                {showModal && editingStudent && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>Edit Student</h3>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={editingStudent.fullName}
                                onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={editingStudent.email}
                                onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Department"
                                value={editingStudent.department}
                                onChange={(e) => setEditingStudent({ ...editingStudent, department: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Batch"
                                value={editingStudent.batch}
                                onChange={(e) => setEditingStudent({ ...editingStudent, batch: e.target.value })}
                            />
                            {/*<input*/}
                            {/*    type="text"*/}
                            {/*    placeholder="Avatar (required)"*/}
                            {/*    value={editingStudent.avatar}*/}
                            {/*    onChange={(e) => setEditingStudent({ ...editingStudent, avatar: e.target.value })}*/}
                            {/*/>*/}
                            <div className="modal-actions">
                                <button onClick={handleUpdate}>Update</button>
                                <button onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageStudents;
