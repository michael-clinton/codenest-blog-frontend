import React, { useState } from 'react';
import axiosInstance from '../api/axios'; // Ensure you have your axios instance configured

const NewsletterWidget = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    if (!email) {
      setMessage('Please enter your email');
      return;
    }
    try {
      // Use axiosInstance to send email to backend API
      await axiosInstance.post('/api/newsletter/subscribe', { email });
      setMessage('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage('Email already subscribed.');
      } else {
        setMessage('Subscription failed. Please try again.');
      }
    }
  };

  return (
    <div className="single-sidebar-widget newsletter-widget">
      <h4 className="single-sidebar-widget__title">Newsletter</h4>
      <div className="form-group mt-30">
        <div className="col-autos">
          <input
            type="email"
            className="form-control"
            id="inlineFormInputGroup"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'Enter email')}
          />
        </div>
      </div>
      <button
        className="bbtns d-block mt-20 w-100"
        onClick={handleSubscribe}
      >
        Subscribe
      </button>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default NewsletterWidget;
