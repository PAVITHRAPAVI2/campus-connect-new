import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FacultyDashboard from './Pages/Faculty/Facultydashboard';
import DashboardLayout from './components/DashboardLayout';
import GroupChat from './Pages/Faculty/GroupChat';
import NoticeBoard from './Pages/Faculty/NoticeBoard';
import LoginPage from './Pages/Login';
import StudentApproval from './Pages/Faculty/StudentApproval';
import DepartmentGroupChat from './Pages/Faculty/DepartmentChat';
import Register from './Pages/Register';
import ManageStudents from './Pages/Faculty/ManageStudent';
import ManageFaculty from './Pages/Admin/managefaculty';
import StudentDashboard from './Pages/Student/StudentDashboard';


const App= () =>{
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/faculty" element={< FacultyDashboard />} />
                <Route path="/DashboardLayout" element={< DashboardLayout />} />
                <Route path="/faculty/Groupchat" element={< GroupChat />} />
                <Route path="/faculty/Notice" element={< NoticeBoard />} />
                <Route path="/login" element={< LoginPage/>} />
                <Route path="/faculty/Approval" element={< StudentApproval/>} />
                <Route path="/faculty/departmentchat" element={< DepartmentGroupChat />} />
                <Route path="/Signup" element={< Register />} />
                <Route path="/Faculty/ManageStudent" element={< ManageStudents />} />
                <Route path="/admin/ManageStudent" element={<ManageFaculty />} />
                <Route path="/student" element={<StudentDashboard/>} />


            </Routes>
        </Router>
    );
}
export default App;
