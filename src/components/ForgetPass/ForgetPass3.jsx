import React, { useState } from 'react';
const ForgotPassword3 = () => {
  const [newPassword, setNewPassword] = useState('');

  

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
      <button>Reset Password</button>
    </div>
  );
};

export default ForgotPassword3;
