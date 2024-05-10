import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useI18nContext } from '../context/i18n-context';

const API_password = 'https://store-system-api.gleeze.com/api/users/updateMyPassword';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
const language =useI18nContext();
  let token = Cookies.get("token");

  const handleEditPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_password}`, {
        currentPassword,
        password,
        confirmPassword,
      }, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem('token', response.data.token)

    } catch (error) {
      console.error('An error occurred while sending the reset password request', error);
      setError('Password change failed. Please check your inputs and try again.');
    }
    window.location.href = '/information'
  };

  return (
    <div className={`bg-gray-700 bg-opacity-25 mx-10 rounded-md pt-2 absolute top-32 -z-3 w-3/4 p-4 ${language === "ar" ? "left-10" : "right-10"}`} >
      <h3 className='font-bold text-white'>Change Password Page</h3>
      <form className=''>
        <label htmlFor='password'>Current Password :</label>
        <input id='password' className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
          type='password' name='currentPassword' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <label htmlFor='newPassword'>New Password :</label>
        <input id='newPassword' className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
          type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor='confirmPassword'>Confirm New Password :</label>
        <input type='password' className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
          id='confirmPassword' name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button onClick={handleEditPassword} className="bg-yellow-900  rounded-lg hover:bg-yellow-800 fw-bold">Change Password</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ChangePassword;

