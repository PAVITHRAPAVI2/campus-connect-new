import React from 'react';
import './UserProfile.css';

const UserProfile = ({ user }) => {
    if (!user) return <p>Loading profile...</p>;

    return (
        <div className="user-profile">
            <h2>My Profile</h2>
            <div className="profile-card">
                <p><strong>College ID:</strong> {user.collegeId}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Department:</strong> {user.department}</p>
                <p><strong>Branch:</strong> {user.branch}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
        </div>
    );
};

export default UserProfile;
