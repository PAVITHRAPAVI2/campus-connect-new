// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './Pages/Student/Register';
import ProfilePage from './Pages/Student/ProfilePage'; // ✅ fixed casing "pages" → "Pages"
import StudentDashboard from './Pages/Student/StudentDashboard';
import { AuthProvider } from './AuthContext';



function App() {
    return (
        <AuthProvider> {/* ✅ Wrap the entire app with AuthProvider */}
            <Router>
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/student/profile" element={<ProfilePage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
