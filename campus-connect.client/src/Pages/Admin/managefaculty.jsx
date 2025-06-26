import React, { useState, useEffect } from 'react';
import './usermanage.css';
import { FaCheckCircle, FaTimesCircle, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import DashboardLayout from '../../components/dashboardlayout';
import BASE_URL from '../../config.js';

const ManageFaculty = () => {
    const [search, setSearch] = useState('');
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [facultyData, setFacultyData] = useState({
        fullName: '',
        collegeId: '',
        email: '',
        department: '',
        password: ''
    });

    const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
    const [selectedStatus, setSelectedStatus] = useState('All Status');

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

    useEffect(() => {
        fetchFaculty();
    }, []);

    const showPopup = (message, duration = 3000) => {
        setPopupMessage(message);
        setTimeout(() => setPopupMessage(''), duration);
    };

    const filteredFaculty = faculty.filter(user => {
        const matchesSearch =
            user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            user.collegeId?.toLowerCase().includes(search.toLowerCase());

        const matchesDepartment =
            selectedDepartment === 'All Departments' || user.department === selectedDepartment;

        const matchesStatus =
            selectedStatus === 'All Status' ||
            (user.status || 'Pending').toLowerCase() === selectedStatus.toLowerCase();

        return matchesSearch && matchesDepartment && matchesStatus;
    });

    const handleCreateFaculty = async () => {
        setCreating(true);
        try {
            await axios.post(`${BASE_URL}/Faculties/register-faculty`, {
                ...facultyData,
                role: 'Faculty'
            });

            showPopup('Faculty created successfully!');
            await fetchFaculty();
            setShowModal(false);
            setFacultyData({
                fullName: '',
                collegeId: '',
                email: '',
                department: '',
                password: ''
            });
        } catch (err) {
            console.error('Error creating faculty:', err);
            showPopup('Failed to create faculty');
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put(`${BASE_URL}/Faculties/update-status/${id}`, { status });
            showPopup(`Faculty ${status}`);
            fetchFaculty();
        } catch (err) {
            console.error('Failed to update status:', err);
            showPopup('Status update failed');
        }
    };

    const handleDeleteFaculty = async (id) => {
        if (!window.confirm('Are you sure you want to delete this faculty?')) return;
        try {
            await axios.delete(`${BASE_URL}/Faculties/delete/${id}`);
            showPopup('Faculty deleted successfully!');
            fetchFaculty();
        } catch (err) {
            console.error('Failed to delete faculty:', err);
            showPopup('Delete failed');
        }
    };

    return (
        <DashboardLayout>
            <div className="manage-students-container">
                <div className="header-row">
                    <div>
                        <h2>Manage Faculty</h2>
                        <p>View and manage all faculty users</p>
                    </div>
                    <button className="create-btn" onClick={() => setShowModal(true)}>
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
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option>All Status</option>
                        <option>Approved</option>
                        <option>Pending</option>
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
                            <span>Status</span>
                            <span>Actions</span>
                        </div>

                        {filteredFaculty.map((user, idx) => (
                            <div className="table-row" key={idx}>
                                <div className="user-cell">
                                    <div className="avatar">
                                        {user.fullName?.slice(0, 2).toUpperCase() || 'NA'}
                                    </div>
                                    <div>
                                        <strong>{user.fullName || user.name}</strong>
                                        <div className="email">{user.email}</div>
                                    </div>
                                </div>
                                <span>{user.collegeId}</span>
                                <span>{user.department}</span>
                                <span className={`badge ${user.approval ? 'active' : 'pending'}`}>
                                    {user.approval ? 'Active' : 'Pending'}
                                </span>

                                <span className="actions">
                                    <FaCheckCircle
                                        className="approve-icon"
                                        onClick={() => handleUpdateStatus(user.id, 'Approved')}
                                        title="Approve"
                                    />
                                    <FaTimesCircle
                                        className="reject-icon"
                                        onClick={() => handleUpdateStatus(user.id, 'Rejected')}
                                        title="Reject"
                                    />
                                    <FaTrash
                                        className="delete-icon"
                                        onClick={() => handleDeleteFaculty(user.id)}
                                        title="Delete"
                                    />
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>Create Faculty</h3>

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
                                placeholder="Password"
                                value={facultyData.password}
                                onChange={(e) => setFacultyData({ ...facultyData, password: e.target.value })}
                            />

                            <div className="modal-actions">
                                <button onClick={handleCreateFaculty} disabled={creating}>
                                    {creating ? 'Creating...' : 'Create'}
                                </button>
                                <button onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {popupMessage && (
                    <div className="popup-message">
                        {popupMessage}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageFaculty;
