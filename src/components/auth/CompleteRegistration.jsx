import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../api/axios";

const CompleteRegistration = ({ email }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleOtpChange = e => setOtp(e.target.value);

  const complete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axiosInstance.post('/api/auth/complete-registration', { email, otp });

      // Store token and user data if returned
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      setMessage(res.data.message || 'Registration complete');

      // Redirect now that we're logged in
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Error completing registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={complete}
      className="card p-4 w-100"
      style={{ maxWidth: 400, margin: 'auto', marginTop: '20px' }}
    >
      <h3 className="text-center mb-3">Register (Step 2)</h3>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <input
        className="form-control mb-3"
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={handleOtpChange}
        required
      />

      <button
        className="btn btn-success w-100"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Verifying OTP...' : 'Complete Registration'}
      </button>
    </form>
  );
};

export default CompleteRegistration;
