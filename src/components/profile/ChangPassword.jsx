import React, { useState } from 'react';
import styles from './Profile.module.css';
import axios from 'axios';
import { Translate } from 'translate-easy';
import Cookies from 'js-cookie';

const API_password = 'https://store-system-api.gleeze.com/api/users/updateMyPassword';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  let token = Cookies.get("token");

  const handleEditPassword = async (e) => {
    e.preventDefault(); // Prevent default form submission

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
    window.location.href = '/profile'
  };

  return (
    <div className="bg-gray-700 bg-opacity-25 mx-10 rounded-md py-4 px-4  text-gray-200">
      <h3 className='font-bold text-white'>Change Password Page</h3>
      <form className=''>
        <label htmlFor='password'><Translate>Current Password :</Translate></label>
        <input id='password' className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
          type='password' name='currentPassword' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <label htmlFor='newPassword'><Translate>New Password :</Translate></label>
        <input id='newPassword' className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
          type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor='confirmPassword'><Translate>Confirm New Password :</Translate></label>
        <input type='password' className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
          id='confirmPassword' name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button onClick={handleEditPassword} className="bg-yellow-900  rounded-lg hover:bg-yellow-800 fw-bold"><Translate>An Editing</Translate></button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ChangePassword;

