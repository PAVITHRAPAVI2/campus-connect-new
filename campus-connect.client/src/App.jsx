// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Pages/Student/Register'; 
import StudentDashboard from './Pages/Student/StudentDashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/studentdashboard" element={<StudentDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
