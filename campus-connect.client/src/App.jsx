// Importing necessary modules from React and react-router-dom
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importing page components
import LandingPage from './pages/Faculty/LandingPage';
import NoticeBoard from './components/NoticeBoard';
import StudentApproval from './components/StudentApproval';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './components/LoginPage';
import CommonGroupChat from './components/CommonGroupChat';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Faculty Dashboard Routes */}
                <Route path="/faculty" element={<DashboardLayout />}>
                    <Route path="notice-board" element={<NoticeBoard />} />
                    <Route path="student-approvals" element={<StudentApproval />} />
                    <Route path="group-chat" element={<CommonGroupChat />} /> 
                    {/* You can add a default dashboard page with <Route index element={<DashboardHome />} /> */}
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
