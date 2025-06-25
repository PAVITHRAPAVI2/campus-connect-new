import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FacultyDashboard from './Pages/Faculty/Facultydashboard';
import DashboardLayout from './components/DashboardLayout';
import GroupChat from './Pages/Faculty/GroupChat';


const App= () =>{
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/faculty" element={< FacultyDashboard />} />
                <Route path="/DashboardLayout" element={< DashboardLayout />} />
                <Route path="/Groupchat" element={< GroupChat />} />



            </Routes>
        </Router>
    );
}

export default App;
