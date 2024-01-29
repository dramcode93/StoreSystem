import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const ForgotPassword2 = () => {
  const [verificationCode, setVerificationCode] = useState('');
 

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
      <Link to='/forgotPassword3' className='btn btn-primary w-100'>Next</Link>
      </div>
  );
};

export default ForgotPassword2;
