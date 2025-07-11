﻿import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.map(role => role.toLowerCase()).includes(userRole?.toLowerCase())
    ) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
