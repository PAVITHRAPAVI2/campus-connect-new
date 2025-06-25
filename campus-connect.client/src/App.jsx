import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/student/login.jsx';
import StudentApproval from './Pages/Admin/studentapproval.jsx';
import ManageStudents from './Pages/Admin/usermanage.jsx';
import ManageFaculty from './Pages/Admin/managefaculty.jsx';
import NoticeBoard from './Pages/Admin/noticeboard.jsx';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/usermanagement" element={<ManageStudents />} />
            <Route path="/studentapproval" element={<StudentApproval />} />
            <Route path="/managefaculty" element={<ManageFaculty />} />
            <Route path="/notices" element={<NoticeBoard/>} />
        </Routes>
    );
};

export default App;
