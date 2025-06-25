// src/Pages/Student/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Styless/Footer';
import '../../Pages/Student/student style/Register.css';
import config from '../../config';

function Register() {
    const [form, setForm] = useState({
        collegeId: '',
        fullName: '',
        department: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [joinYear, setJoinYear] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const getBatchRange = () => {
        if (!joinYear) return '';
        const endYear = parseInt(joinYear, 10) + 3;
        return `${joinYear} - ${endYear}`;
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        const batchRange = getBatchRange();

        if (!batchRange) {
            toast.warn('Please select a join year');
            return;
        }

        if (form.password !== form.confirmPassword) {
            toast.warn('Passwords do not match');
            return;
        }

        const payload = {
            collegeId: form.collegeId,
            fullName: form.fullName,
            department: form.department,
            email: form.email,
            password: form.password,
            batch: batchRange
        };

        try {
            const res = await axios.post(
                `${config.apiBaseUrl}Auth/register-student`,
                payload
            );

            if (res.status === 200) {
                toast.success(
                    ({ closeToast }) => (
                        <div style={{ textAlign: 'center' }}>
                            <p className="font-semibold">🎉 Registration successful!</p>
                            <p className="mb-2 text-sm opacity-80">You can now log in.</p>
                            <button
                                className="px-3 py-1 rounded bg-blue-600 text-white"
                                onClick={() => {
                                    closeToast();
                                    navigate('/login');
                                }}
                            >
                                Go to Login
                            </button>
                        </div>
                    ),
                    { autoClose: false, position: "top-center" }
                );

                setForm({
                    collegeId: '',
                    fullName: '',
                    department: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                setJoinYear('');
            }
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data ||
                'Registration failed';
            toast.error(msg, { position: "top-center" });
        }
    };

    return (
        <>
            <div className="register-container">
                <div className="register-box">
                    <h2>Student Register</h2>
                    <p>Fill in your details to create an account</p>

                    <input
                        type="text"
                        name="collegeId"
                        placeholder="College ID"
                        value={form.collegeId}
                        onChange={handleChange}
                        className="input mb-3"
                    />

                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={form.fullName}
                        onChange={handleChange}
                        className="input mb-3"
                    />

                    <select
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        className="input mb-3"
                    >
                        <option value="">Department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Maths">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                    </select>

                    <select
                        name="joinYear"
                        value={joinYear}
                        onChange={(e) => setJoinYear(e.target.value)}
                        className="input mb-3"
                    >
                        <option value="">Select Join Year</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>

                    <input
                        type="text"
                        name="batch"
                        placeholder="Batch (e.g., 2022 - 2025)"
                        value={getBatchRange()}
                        readOnly
                        className="input mb-3"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="input mb-3"
                    />

                    <div className="relative mb-3">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="input pr-10"
                        />
                        <span
                            className="input-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                    </div>

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="input mb-3"
                    />

                    <button onClick={handleSubmit}>Register</button>

                    <p className="mt-3 text-sm text-center">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-blue-600 underline hover:no-underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            <Footer />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
}

export default Register;
