import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/auth.css';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Email verified successfully. You can now log in.');
        navigate('/login');
      } else {
        alert(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error(error);
      alert('Unable to verify email. Please try again later.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Verify Email</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" className="btn">Verify</button>
        <p>Already verified? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default VerifyEmail;
