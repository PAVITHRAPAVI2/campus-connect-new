// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Pages/Student/Register'; 
import StudentDashboard from './Pages/Student/StudentDashboard';
import LoginPage from './pages/Student/LoginPage';
import UserProfile from './pages/Student/UserProfile';
import NoticeBoard from './pages/Student/StudentNoticeBoard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/notices" element={<NoticeBoard />} />

            </Routes>
        </Router>
    );
}

export default App;
