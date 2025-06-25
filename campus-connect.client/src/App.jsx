// Importing necessary modules from React and react-router-dom
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importing page components
import LandingPage from './pages/Faculty/LandingPage';
import NoticeBoard from './components/NoticeBoard';
import StudentApproval from './components/StudentApproval';
import DashboardLayout from './components/DashboardLayout';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public landing page */}
                <Route path="/" element={<LandingPage />} />

                {/* Faculty dashboard with nested routes */}
                <Route path="/faculty" element={<DashboardLayout />}>
                    <Route path="notice-board" element={<NoticeBoard />} />
                    <Route path="student-approvals" element={<StudentApproval />} />
                    {/* You can add a default dashboard here like <Route index element={<DashboardHome />} /> */}
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
