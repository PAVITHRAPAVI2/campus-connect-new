// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Admin Pages
import StudentApproval from './Pages/Admin/studentapproval.jsx';
import ManageStudents from './Pages/Admin/usermanage.jsx';
import ManageFaculty from './Pages/Admin/managefaculty.jsx';
import AdminNoticeBoard from './Pages/Admin/noticeboard.jsx';
import AdminDashboard from './Pages/Admin/dashboard.jsx';
import CommonGroupChatContent from './Pages/Admin/groupchat.jsx';
import ForgotPassword from './Pages/Admin/forget.jsx';
import DepartmentGroupChatContent from './Pages/Admin/depgroupchat.jsx';

// Student Pages
import Register from './Pages/Student/Register';
import StudentDashboard from './Pages/Student/StudentDashboard';
import LoginPage from './Pages/Student/LoginPage';
import UserProfile from './Pages/Student/UserProfile';
import StudentNoticeBoard from './Pages/Student/StudentNoticeBoard';
import DepartmentGroupChat from './Pages/Student/DepartmentGroupChat';
import CommonGroupChat from './Pages/Student/CommonGroupChat';
import LandingPage from './Pages/Student/LandingPage';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Common Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forget" element={<ForgotPassword />} />

                {/* Student Routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/notices" element={<StudentNoticeBoard />} />
                <Route path="/commonchat" element={<CommonGroupChat />} />
                <Route path="/depchat" element={<DepartmentGroupChat />} />

                {/* Admin Routes */}
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/studentapproval" element={<StudentApproval />} />
                <Route path="/usermanagement" element={<ManageStudents />} />
                <Route path="/managefaculty" element={<ManageFaculty />} />
                <Route path="/notices-admin" element={<AdminNoticeBoard />} />
                <Route path="/groupchat" element={<CommonGroupChatContent />} />
                <Route path="/depchart" element={<DepartmentGroupChatContent />} />
            </Routes>
        </Router>
    );
};

export default App;
