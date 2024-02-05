import React, { useState } from 'react';
import axios from 'axios';

const ForgetPassword1 = () => {
const [email, setEmail] = useState('');

  const handleForgetPassword = async () => {
    try {
      const response = await axios.post('https://unusual-blue-button.cyclic.app/api/auth/forgetPassword', {
        email: email,
      });
            const resetToken = response.data.resetToken;
            localStorage.setItem('resetToken', resetToken);
            window.location.href = '/forgotPassword2';
       if (response.status === 200) {
        console.log('Reset password code sent successfully!');
       } else {
        console.error('Failed to send reset password code');
       }
    } catch (error) {
      console.error('An error occurred while sending the reset password request', error);
     }
  };

  return (
    <div>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleForgetPassword}>Send Reset Code</button> 
    </div> 
  );
};

export default ForgetPassword1;
