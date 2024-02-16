import axios from 'axios';
import React, { useState } from 'react';
import { Translate } from 'translate-easy';
import forget from './forget.module.css'; 

const ForgotPassword3 = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const resetToken = localStorage.getItem('resetToken');

  const handleForgetPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.put('http://192.168.43.191:3030/api/auth/resetPassword', {
        newPassword,
        confirmNewPassword,
      },{ headers: { Authorization: `Bearer ${resetToken}` } });
      setLoading(false);
      window.location.href = '/';
    } catch (error) {
      console.error('An error occurred while sending the reset password request', error);
      setLoading(false);
    }
  };

  return (
    <div className={forget.forgetPasswordContainer3}>
      <h4><Translate>Step 3 : Reset Password</Translate></h4>
      <p><Translate>Choose a new password for your account : </Translate></p>
      <input className={forget.firstInput}
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <p><Translate>Confirm password :</Translate></p>
      <input className={forget.firstInput}
        type="password"
        placeholder="Confirm new password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />
      <button onClick={handleForgetPassword} disabled={loading}>
        {loading ? <Translate>Loading...</Translate> : <Translate>Reset Password</Translate>}
      </button>
    </div>
  );
};

export default ForgotPassword3;
