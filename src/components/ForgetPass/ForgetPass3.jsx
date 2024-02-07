import axios from 'axios';
import React, { useState } from 'react';
const ForgotPassword3 = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const resetToken =  ('resetToken');

  const handleForgetPassword = async () => {
    try {
      const response = await axios.put('https://lucky-fox-scarf.cyclic.app/api/auth/resetPassword', {
        newPassword,
        confirmNewPassword,
      },{ headers: { Authorization: `Bearer ${resetToken}` } });
              window.location.href = '/';
       if (response.status === 200) {
        console.log('new password code successfully!');
       } else {
        console.error('Failed to send new password ');
       }
    } catch (error) {
      console.error('An error occurred while sending the reset password request', error);
     }
  };

  return (
    <div className="container1 ForgotPasswordStep3">
      <h1>Step 3: Reset Password</h1>
      <p>Choose a new password for your account.</p>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <p>Confirm password.</p>
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />
      <button onClick={handleForgetPassword}>Reset Password</button>
    </div>
  );
};

export default ForgotPassword3;
