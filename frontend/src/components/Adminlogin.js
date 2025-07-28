import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Adminlogin.css';

const AdminLoginPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'superadmin') {
      navigate('/superadmin');
    }
  }, [navigate]);

  const handleRegisterClick = () => {
    setIsActive(true);
    setIsRegisterActive(false);
    setFormData({
      username: '',
      email: '',
      password: ''
    });
    setMessage(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      setMessage('User registered successfully');
      setFormData({
        username: '',
        email: '',
        password: ''
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(error.message);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/adminlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      if (data.role === 'admin') {
        navigate('/admin');
      } else if (data.role === 'superadmin') {
        navigate('/superadmin');
      } else {
        console.error('Unknown user role:', data.role);
      }
    } catch (error) {
      setMessage(error.message);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgotpassword');
  };

  return (
    <div className={`admin-container ${isRegisterActive ? 'active' : ''}`}>
      <div className={`admin-form-container admin-sign-up ${isRegisterActive ? 'active' : ''}`}>
        <form onSubmit={handleSignUpSubmit}>
          <h1>Create Account</h1>
          <input type="text" name="username" placeholder="Name" value={formData.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit">Sign Up</button>
          {message && <div className="message">{message}</div>}
        </form>
      </div>
      <div className={`admin-form-container admin-sign-in ${!isActive ? '' : 'active'}`}>
        <form onSubmit={handleLoginSubmit}>
          <h1>Sign In</h1>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit">Sign In</button>
          <div className="forgot-password-link" onClick={handleForgotPassword}>Forgot Password?</div>
          {message && <div className="message">{message}</div>}
        </form>
      </div>
      <div className="admin-toggle-container">
        <div className="admin-toggle">
          <div className="admin-toggle-panel admin-toggle-left">
            <h1>Welcome Friend!</h1>
            <p>Enter your personal details to use all site features</p>
            <button id="admin-login" onClick={handleRegisterClick}>Sign In</button>
          </div>
          <div className="admin-toggle-panel admin-toggle-right">
            <h1>Welcome, Back!</h1>
            <p>Enter your personal details to use all site features</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
