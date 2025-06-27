import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/student/login.jsx';
import StudentApproval from './Pages/Admin/studentapproval.jsx';
import ManageStudents from './Pages/Admin/usermanage.jsx';
import ManageFaculty from './Pages/Admin/managefaculty.jsx';
import NoticeBoard from './Pages/Admin/noticeboard.jsx';
import Dashboard from './Pages/Admin/dashboard.jsx';
import CommonGroupChatContent from './Pages/Admin/groupchat.jsx';
import ForgotPassword from './Pages/Admin/forget.jsx';
import DepartmentGroupChatContent from './Pages/Admin/depgroupchat.jsx';


const App = () => {
    return (
        <Routes>
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/usermanagement" element={<ManageStudents />} />
            <Route path="/studentapproval" element={<StudentApproval />} />
            <Route path="/managefaculty" element={<ManageFaculty />} />
            <Route path="/notices" element={<NoticeBoard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groupchat" element={<CommonGroupChatContent />} />
            <Route path="/forget" element={< ForgotPassword />} />
            <Route path="/depchart" element={<DepartmentGroupChatContent />} />
        </Routes>
    );
};

export default App;
