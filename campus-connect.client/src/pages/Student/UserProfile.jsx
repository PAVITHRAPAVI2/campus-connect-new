// src/Pages/Student/UserProfile.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../Student/student style/UserProfile.css';
import DashboardLayout from '../../components/Styless/DashboardLayout';

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const logoutAndRedirect = useCallback(() => {
        ['token', 'role', 'userId', 'fullName'].forEach(localStorage.removeItem);
        navigate('/login', { replace: true });
    }, [navigate]);

    const fetchProfile = useCallback(async () => {
        try {
            const { data } = await axios.get(
                'https://campusconnect.tryasp.net/api/Auth/profile',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(data);
        } catch (err) {
            if (err.response?.status === 401) logoutAndRedirect();
            else {
                console.error('Profile fetch error', err);
                setError('Unable to load profile.');
            }
        } finally {
            setLoading(false);
        }
    }, [token, logoutAndRedirect]);

    useEffect(() => {
        if (!token) logoutAndRedirect();
        else fetchProfile();
    }, [token, fetchProfile, logoutAndRedirect]);

    const handleEdit = () => {
        setEditedName(user.fullName);
        setEditedEmail(user.email);
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    const handleSave = async () => {
        try {
            // Replace with your real update API endpoint
            const updateUrl = `https://campusconnect.tryasp.net/api/Students/students/${user.id}`;
            const payload = {
                ...user,
                fullName: editedName,
                email: editedEmail
            };

            await axios.put(updateUrl, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser({ ...user, fullName: editedName, email: editedEmail });
            setEditMode(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
            alert('Update failed. Try again.');
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="profile-loading">Loading profile…</div>
            </DashboardLayout>
        );
    }

    if (error || !user) {
        return (
            <DashboardLayout>
                <div className="profile-loading error">{error || 'No profile data.'}</div>
                <button className="logout-btn" onClick={logoutAndRedirect}>
                    Return to Login
                </button>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="profile-container">
                <div className="profile-card">
                    {user.avatar && (
                        <img src={user.avatar} alt="avatar" className="profile-avatar" />
                    )}

                    <h2>👤 User Profile</h2>

                    <div className="profile-info">
                        <p><strong>College ID:</strong> {user.collegeId}</p>

                        {editMode ? (
                            <>
                                <p><strong>Full Name:</strong>
                                    <input
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="edit-input"
                                    />
                                </p>
                                <p><strong>Email:</strong>
                                    <input
                                        value={editedEmail}
                                        onChange={(e) => setEditedEmail(e.target.value)}
                                        className="edit-input"
                                    />
                                </p>
                            </>
                        ) : (
                            <>
                                <p><strong>Full Name:</strong> {user.fullName}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                            </>
                        )}

                        {user.department && (
                            <p><strong>Department:</strong> {user.department}</p>
                        )}
                        {user.batch && (
                            <p><strong>Batch:</strong> {user.batch}</p>
                        )}
                    </div>

                    {editMode ? (
                        <div className="button-row">
                            <button className="save-btn" onClick={handleSave}>💾 Save</button>
                            <button className="cancel-btn" onClick={handleCancel}>❌ Cancel</button>
                        </div>
                    ) : (
                        <button className="edit-btn" onClick={handleEdit}>✏️ Edit Profile</button>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
