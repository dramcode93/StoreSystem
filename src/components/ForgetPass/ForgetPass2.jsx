import axios from 'axios';
import React, { useState } from 'react';
 const ForgotPassword2 = () => {
  const [verificationCode, setVerificationCode] = useState('');
   const resetToken = localStorage.getItem('resetToken');
   const handleForgetPassword = async () => {
    try {
      const response = await axios.post('https://rich-blue-moth-slip.cyclic.app/api/auth/verifyResetPasswordCode', {
        resetCode: verificationCode,
      },{ headers: { Authorization: `Bearer ${resetToken}` } });
              window.location.href = '/forgotPassword3';
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
    <div className="container1 ForgotPasswordStep2">
      <h1>Step 2: Verify Identity</h1>
      <p>
        We've sent a verification code to your email. Please enter the code below.
      </p>
      <input
        type="text"
        placeholder="Enter verification code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <button onClick={handleForgetPassword}> Reset Password</button> 
      </div>
  );
};

export default ForgotPassword2;
