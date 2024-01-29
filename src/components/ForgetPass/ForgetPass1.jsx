import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const ForgotPassword1 = () => {
  const [email, setEmail] = useState('');

 
  return (
    <div className="container1 ForgotPasswordStep1">
      <h1>Step 1: Enter Email</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Link to='/forgotPassword2' className='btn btn-primary w-100'>Next</Link>
    </div>
  );
};

export default ForgotPassword1;
