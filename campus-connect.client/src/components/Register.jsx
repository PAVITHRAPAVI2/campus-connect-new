import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

import Navbar from './Navbar';
import Footer from './Footer';
import './styles/Register.css';
import config from "../config";


function Register() {
    const [form, setForm] = useState({
        collegeId: '',
        fullName: '',
        department: '',
        location: '', // ✅ Added location field
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [joinYear, setJoinYear] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const batchRange = () =>
        joinYear ? `${joinYear} - ${parseInt(joinYear, 10) + 3}` : '';

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        if (!joinYear) return toast.warn('Please select a join year');
        if (form.password !== form.confirmPassword)
            return toast.warn('Passwords do not match');

        try {
            await axios.post(`${config.apiBaseUrl}Auth/register-student`, {
                ...form,
                batch: batchRange(),
            });

            setShowModal(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data ||
                'Registration failed';
            toast.error(msg);
        }
    };

    return (
        <>
            <Navbar />

            {!showModal && (
                <div className="register-container">
                    <div className="register-box">
                        <h2>Student Register</h2>
                        <p>Fill in your details to create an account</p>

                        <input
                            className="input"
                            name="collegeId"
                            placeholder="College ID"
                            value={form.collegeId}
                            onChange={handleChange}
                        />

                        <input
                            className="input"
                            name="fullName"
                            placeholder="Full Name"
                            value={form.fullName}
                            onChange={handleChange}
                        />

                        <select
                            className="input"
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                        >
                            <option value="">Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Maths">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                        </select>

                        <input
                            className="input"
                            name="location"
                            placeholder="Location"
                            value={form.location}
                            onChange={handleChange}
                        />

                        <select
                            className="input"
                            name="joinYear"
                            value={joinYear}
                            onChange={(e) => setJoinYear(e.target.value)}
                        >
                            <option value="">Select Join Year</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>

                        <input
                            className="input"
                            name="batch"
                            placeholder="Batch"
                            value={batchRange()}
                            readOnly
                        />

                        <input
                            className="input"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                        />

                        <div className="relative">
                            <input
                                className="input pr-10"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                            />
                            <span
                                className="input-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                        </div>

                        <input
                            className="input"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />

                        <button onClick={handleSubmit}>Register</button>

                        <p className="to-login">
                            Already have an account?{' '}
                            <Link to="/login" className="link">
                                Sign in
                            </Link>
                        </p>

                        <ToastContainer
                            position="top-center"
                            autoClose={3000}
                            className="form-toast-container"
                            toastClassName="form-toast"
                            bodyClassName="form-toast-body"
                        />
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <img
                            src="https://img.icons8.com/color/96/ok--v1.png"
                            alt="success"
                            className="modal-icon"
                        />
                        <h3>Registration Successful!</h3>
                        <p>You will be redirected to login shortly.</p>
                        <button
                            className="modal-btn"
                            onClick={() => navigate('/login')}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default Register;
