import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Pages/Student/student style/Login.css';
import Navbar from '../../components/Styless/Navbar';
import Footer from '../../components/Styless/Footer';
import BASE_URL from '../../config.js';

const LoginPage = () => {
  const [collegeId, setCollegeId] = useState('');
  const [password, setPassword]  = useState('');
  const [error, setError]        = useState('');
  const [success, setSuccess]    = useState('');
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!collegeId.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setSuccess('');
      return;
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/Auth/login`, {
        collegeId,
        password
      });

      
      if (data?.token) {
        localStorage.setItem('token',     data.token);
        localStorage.setItem('role',      data.role);
        localStorage.setItem('userId',    data.userId);
        localStorage.setItem('fullName',  data.fullName);

        setSuccess('Login successful! Redirecting…');
        setError('');

        /* redirect based on role */
        const target =
          data.role === 'Admin'   ? '/admin'   :
          data.role === 'Teacher' ? '/teacher' :
          /* default Student */      '/student';

        setTimeout(() => navigate(target), 1500);
      } else {
        setError('Invalid login credentials');
        setSuccess('');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK'
          ? 'Network error: Cannot connect to the server.'
          : 'Login failed. Please try again.');
      setError(msg);
      setSuccess('');
    }
  };

 
  return (
    <>
      <Navbar />

      <div className="login-wrapper">
        <form className="login-container" onSubmit={handleSubmit}>
          <h2>Student Login</h2>

          <input
            type="text"
            placeholder="College ID"
            value={collegeId}
            onChange={(e) => setCollegeId(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="forgot-password">
            <Link to="/forget">Forgot Password?</Link>
          </div>

          <button type="submit">Login</button>

          {error   && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <div className="register-link">
            <p>
              Don't have an account? <Link to="/">Register here</Link>
            </p>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default LoginPage;
