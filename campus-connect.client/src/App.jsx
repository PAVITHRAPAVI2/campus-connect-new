import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/student/login.jsx';
import StudentApproval from './Pages/Admin/studentapproval.jsx';
import ManageStudents from './Pages/Admin/usermanage.jsx';
import ManageFaculty from './Pages/Admin/managefaculty.jsx';
import NoticeBoard from './Pages/Admin/noticeboard.jsx';
import LandingPage from './components/LandingPage';
import FacultyDashboard from './Pages/Faculty/Facultydashboard';
import DashboardLayout from './components/DashboardLayout';
import GroupChat from './Pages/Faculty/GroupChat';

const App = () => {
    return (
        <Routes>
           
            <Route path="/login" element={<LoginPage />} />
            <Route path="/usermanagement" element={<ManageStudents />} />
            <Route path="/studentapproval" element={<StudentApproval />} />
            <Route path="/managefaculty" element={<ManageFaculty />} />
            <Route path="/notices" element={<NoticeBoard />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/faculty" element={< FacultyDashboard />} />
            <Route path="/DashboardLayout" element={< DashboardLayout />} />
            <Route path="/Groupchat" element={< GroupChat />} />
        </Routes>
    );
};

export default App;
