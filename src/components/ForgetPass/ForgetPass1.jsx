import React, { useState } from 'react';
import axios from 'axios';
 import forget from './forget.module.css';
import Cookies from 'js-cookie';
import { ErrorAlert } from '../../form/Alert';

const ForgetPassword1 = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgetPassword = async () => {
    try { 
      setLoading(true); 
      const response = await axios.post('https://store-system-api.gleeze.com/api/auth/forgetPassword', {
        email: email,
      });
      const resetToken = response.data.resetToken;
      const tokenTime = 1
      Cookies.set('resetToken', resetToken, { expires: tokenTime, secure: true, sameSite: 'strict' });
      window.location.href = '/forgotPassword2';
    } catch (error) {
      console.error('An error occurred while sending the reset password request', error);
      ErrorAlert({ text: "An error occurred while sending the reset password request" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={forget.forgetPasswordContainer}>
      <label> Email : </label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button className='secondaryBtn' onClick={handleForgetPassword} disabled={loading}>
        {loading ? 'Sending...': 'Send Reset Code'}
      </button>
    </div>
  );
};

export default ForgetPassword1;
