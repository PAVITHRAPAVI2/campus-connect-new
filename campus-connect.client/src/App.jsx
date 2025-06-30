import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/Faculty/LandingPage';
import LoginPage from './components/LoginPage';
import Register from './components/Register';

import DashboardLayout from './components/DashboardLayout';
import NoticeBoard from './components/NoticeBoard';
import StudentApproval from './components/StudentApproval';
import CommonGroupChat from './components/CommonGroupChat';
import DepartmentGroupChat from './components/DepartmentGroupChat';
import ManageStudents from './components/ManageStudents';

import ProtectedRoute from './components/ProtectedRoute';
import FacultyDashboard from './components/Facultydashboard';


const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />

                {/* Faculty Dashboard */}
                <Route
                    path="/faculty"
                    element={
                        <ProtectedRoute allowedRoles={['Faculty']}>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<h2>Welcome Faculty</h2>} />
                    <Route path="notice-board" element={<NoticeBoard />} />
                    <Route path="student-approvals" element={<StudentApproval />} />
                    <Route path="group-chat" element={<CommonGroupChat />} />
                    <Route path="manage-students" element={<ManageStudents />} />
                    <Route path="/faculty/dashboard" element={<FacultyDashboard />} />

                </Route>

                {/* Department Group Chat */}
                <Route
                    path="/chat/department/:department"
                    element={
                        <ProtectedRoute allowedRoles={['Faculty']}>
                            <DepartmentGroupChat />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all */}
                {/*<Route path="*" element={<h2>404 - Page Not Found</h2>} />*/}
            </Routes>
        </Router>
    );
};

export default App;