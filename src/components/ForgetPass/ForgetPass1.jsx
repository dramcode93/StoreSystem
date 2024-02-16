import React, { useState } from 'react';
import axios from 'axios';
import { Translate } from 'translate-easy';
import forget from './forget.module.css'; // Import your CSS file

const ForgetPassword1 = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgetPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://192.168.43.191:3030/api/auth/forgetPassword', {
        email: email,
      });
      const resetToken = response.data.resetToken;
      localStorage.setItem('resetToken', resetToken);
      window.location.href = '/forgotPassword2';
    } catch (error) {
      console.error('An error occurred while sending the reset password request', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={forget.forgetPasswordContainer}> 
      <label><Translate>Email : </Translate></label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleForgetPassword} disabled={loading}>
        {loading ? <Translate>Sending...</Translate> : <Translate>Send Reset Code</Translate>}
      </button>
    </div>
  );
};

export default ForgetPassword1;
