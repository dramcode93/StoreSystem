import axios from 'axios';
import React, { useState } from 'react';
 import forget from './forget.module.css';
import Cookies from 'js-cookie';

const ForgotPassword2 = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const resetToken = Cookies.get('resetToken');

  const handleForgetPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://store-system-api.gleeze.com/api/auth/verifyResetPasswordCode', {
        resetCode: verificationCode,
      }, { headers: { Authorization: `Bearer ${resetToken}` } });
      setLoading(false);
      window.location.href = '/forgotPassword3';
    } catch (error) {
      console.error('An error occurred while sending the reset password request', error);
      setLoading(false);
    }
  };

  return (
    <div className={forget.forgetPasswordContainer}>
      <h4>Step 2 : Verify Identity</h4>
      <p>We've sent a verification code to your email. Please enter the code below.</p>
      <input
        type="text"
        placeholder="Enter verification code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <button onClick={handleForgetPassword} disabled={loading}>
        {loading ? 'Loading...' : 'Reset Password'}
      </button>
    </div>
  );
};

export default ForgotPassword2;
