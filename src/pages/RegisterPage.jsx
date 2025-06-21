import React, { useState } from 'react';
import InitiateRegistration from '../components/auth/InitiateRegistration';
import CompleteRegistration from '../components/auth/CompleteRegistration';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);

  const handleOTPsent = (userEmail) => {
    setEmail(userEmail);
    setStep(2);
  };

  return (
    <div>
      <Header />
      <div style={{ marginTop: '80px', marginBottom: '80px' }}>
        {step === 1 ? (
          <InitiateRegistration onNext={handleOTPsent} />
        ) : (
          <CompleteRegistration email={email} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
