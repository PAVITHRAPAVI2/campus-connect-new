// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import LandingPage from './pages/Faculty/LandingPage';
import LoginPage from './components/LoginPage';
import Register from './components/Register';

// Faculty Protected Pages
import DashboardLayout from './components/DashboardLayout';
import NoticeBoard from './components/NoticeBoard';
import StudentApproval from './components/StudentApproval';
import CommonGroupChat from './components/CommonGroupChat';
import DepartmentGroupChat from './components/DepartmentGroupChat';
import ManageStudents from './components/ManageStudents';

// Route protection
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />

                {/* Faculty Dashboard Routes */}
                <Route
                    path="/faculty"
                    element={
                        <ProtectedRoute allowedRoles={["Faculty"]}>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<h2>Welcome Faculty</h2>} />
                    <Route path="notice-board" element={<NoticeBoard />} />
                    <Route path="student-approvals" element={<StudentApproval />} />
                    <Route path="group-chat" element={<CommonGroupChat />} />
                    <Route path="manage-students" element={<ManageStudents />} />
                </Route>

                {/* Department Group Chat */}
                <Route
                    path="/chat/department/:department"
                    element={
                        <ProtectedRoute allowedRoles={["Faculty"]}>
                            <DepartmentGroupChat />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
