import axios from 'axios';
import React, { useEffect, useState } from 'react';
import forget from './forget.module.css';
import Cookies from 'js-cookie';
import { ErrorAlert } from '../../form/Alert';
import Aos from 'aos'
import 'aos/dist/aos.css'

const ForgotPassword3 = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const resetToken = Cookies.get('resetToken');
  useEffect(() => {
    Aos.init()
  }, [])
  const handleForgetPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.put('https://store-system-api.gleeze.com/api/auth/resetPassword', {
        newPassword,
        confirmNewPassword,
      }, { headers: { Authorization: `Bearer ${resetToken}` } });
      setLoading(false);
      Cookies.remove('resetToken'); // remove token after password is changed
      window.location.href = '/';
    } catch (error) {
      console.error('An error occurred while sending the reset password request', error);
      ErrorAlert({ text: "An error occurred while resetting password" });
      setLoading(false);
    }
  };

  return (
    <div className={forget.forgetPasswordContainer3} data-aos="fade-left" data-aos-delay="300">
      <h4>Step 3 : Reset Password</h4>
      <p>Choose a new password for your account : </p>
      <input className={forget.firstInput}
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <p>Confirm password :</p>
      <input className={forget.firstInput}
        type="password"
        placeholder="Confirm new password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />
      <button className='secondaryBtn' onClick={handleForgetPassword} disabled={loading}>
        {loading ? 'Loading...' : ' Reset Password'}
      </button>
    </div>
  );
};

export default ForgotPassword3;
