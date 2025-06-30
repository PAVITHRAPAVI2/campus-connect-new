// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Pages/Student/Register'; 
import StudentDashboard from './Pages/Student/StudentDashboard';
import LoginPage from './pages/Student/LoginPage';
import UserProfile from './pages/Student/UserProfile';
import NoticeBoard from './pages/Student/StudentNoticeBoard';
import DepartmentGroupChat from './pages/Student/DepartmentGroupChat';
import CommonGroupChat from './pages/Student/CommonGroupChat';
import LandingPage from './pages/Student/LandingPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/notices" element={<NoticeBoard />} />
                <Route path="/commonchat" element={<CommonGroupChat />} />
                <Route path="/depchat" element={<DepartmentGroupChat />} />

            </Routes>
        </Router>
    );
}

export default App;
