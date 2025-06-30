import React, { useState, useEffect } from 'react';
import './usermanage.css';
import { FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import DashboardLayout from '../../components/dashboardlayout';
import BASE_URL from '../../config.js';

const ManageFaculty = () => {
    const [search, setSearch] = useState('');
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingFacultyId, setEditingFacultyId] = useState(null);
    const [popupMessage, setPopupMessage] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

    const [facultyData, setFacultyData] = useState({
        fullName: '',
        collegeId: '',
        email: '',
        department: '',
        password: ''
    });

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/Faculties/faculties`);
            setFaculty(res.data);
        } catch (err) {
            console.error('Failed to fetch faculty:', err);
            showPopup('Error fetching faculty');
        } finally {
            setLoading(false);
        }
    };

    const showPopup = (message, duration = 3000) => {
        setPopupMessage(message);
        setTimeout(() => setPopupMessage(''), duration);
    };

    const resetForm = () => {
        setFacultyData({
            fullName: '',
            collegeId: '',
            email: '',
            department: '',
            password: ''
        });
        setIsEditMode(false);
        setEditingFacultyId(null);
    };

    const handleCreateOrUpdateFaculty = async () => {
        setCreating(true);
        try {
            if (isEditMode) {
                const updatedData = { ...facultyData };
                if (!updatedData.password) {
                    delete updatedData.password; // Don't send password if not updated
                }
                await axios.put(`${BASE_URL}/Faculties/faculties/${editingFacultyId}`, updatedData);
                showPopup('Faculty updated successfully!');
            } else {
                await axios.post(`${BASE_URL}/Faculties/register-faculty`, {
                    ...facultyData,
                    role: 'Faculty'
                });
                showPopup('Faculty created successfully!');
            }
            await fetchFaculty();
            setShowModal(false);
            resetForm();
        } catch (err) {
            console.error('Error saving faculty:', err);
            showPopup('Failed to save faculty');
        } finally {
            setCreating(false);
        }
    };

    const handleEdit = (faculty) => {
        setIsEditMode(true);
        setEditingFacultyId(faculty.id);
        setFacultyData({
            fullName: faculty.fullName,
            collegeId: faculty.collegeId,
            email: faculty.email,
            department: faculty.department,
            password: ''
        });
        setShowModal(true);
    };

    const handleDeleteFaculty = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this faculty?')) return;
        try {
            await axios.delete(`${BASE_URL}/Faculties/faculties/${id}`);
            showPopup('Faculty permanently deleted!');
            fetchFaculty();
        } catch (err) {
            console.error('Failed to delete faculty:', err);
            showPopup('Delete failed');
        }
    };

    const filteredFaculty = faculty.filter(user => {
        const matchesSearch =
            user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            user.collegeId?.toLowerCase().includes(search.toLowerCase());

        const matchesDepartment =
            selectedDepartment === 'All Departments' || user.department === selectedDepartment;

        return matchesSearch && matchesDepartment;
    });

    return (
        <DashboardLayout>
            <div className="manage-students-container">
                <div className="header-row">
                    <div>
                        <h2>Manage Faculty</h2>
                        <p>View and manage all faculty users</p>
                    </div>
                    <button className="create-btn" onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}>
                        + Create Faculty
                    </button>
                </div>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="🔍 Search by name or ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                        <option>All Departments</option>
                        <option>Computer Science</option>
                        <option>Maths</option>
                        <option>Physics</option>
                        <option>Chemistry</option>
                    </select>
                </div>

                {loading ? (
                    <p>Loading faculty...</p>
                ) : filteredFaculty.length === 0 ? (
                    <p>No faculty found.</p>
                ) : (
                    <div className="student-table">
                        <div className="table-header">
                            <span>Faculty</span>
                            <span>Faculty ID</span>
                            <span>Department</span>
                            <span>Actions</span>
                        </div>

                        {filteredFaculty.map((user, idx) => (
                            <div className="table-row" key={idx}>
                                <div className="user-cell">
                                    <div className="avatar">
                                        {user.fullName?.slice(0, 2).toUpperCase() || 'NA'}
                                    </div>
                                    <div>
                                        <strong>{user.fullName}</strong>
                                        <div className="email">{user.email}</div>
                                    </div>
                                </div>
                                <span>{user.collegeId}</span>
                                <span>{user.department}</span>
                                <span className="actions">
                                    <FaEdit
                                        title="Edit"
                                        onClick={() => handleEdit(user)}
                                        style={{ marginRight: '10px', color: 'green', cursor: 'pointer' }}
                                    />
                                    <FaTrash
                                        title="Permanently Delete"
                                        onClick={() => handleDeleteFaculty(user.id)}
                                        style={{ color: 'red', cursor: 'pointer' }}
                                    />
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>{isEditMode ? 'Edit Faculty' : 'Create Faculty'}</h3>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={facultyData.fullName}
                                onChange={(e) => setFacultyData({ ...facultyData, fullName: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="College ID"
                                value={facultyData.collegeId}
                                onChange={(e) => setFacultyData({ ...facultyData, collegeId: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={facultyData.email}
                                onChange={(e) => setFacultyData({ ...facultyData, email: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Department"
                                value={facultyData.department}
                                onChange={(e) => setFacultyData({ ...facultyData, department: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder={isEditMode ? 'New Password (optional)' : 'Password'}
                                value={facultyData.password}
                                onChange={(e) => setFacultyData({ ...facultyData, password: e.target.value })}
                            />

                            <div className="modal-actions">
                                <button onClick={handleCreateOrUpdateFaculty} disabled={creating}>
                                    {creating ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
                                </button>
                                <button onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {popupMessage && (
                    <div className="popup-message">{popupMessage}</div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageFaculty;
