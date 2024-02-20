import React, { useState } from 'react';
import styles from './Profile.module.css';
import axios from 'axios';
import { Translate } from 'translate-easy';

const API_password = 'https://store-system-api.gleeze.com/api/users/updateMyPassword';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  let token = localStorage.getItem("token");

  const handleEditPassword = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.put(`${API_password}`, {
        currentPassword,
        password,
        confirmPassword,
      }, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem('token', response.data.token)
      console.log(response);

    } catch (error) {
      console.error('An error occurred while sending the reset password request', error);
      setError('Password change failed. Please check your inputs and try again.');
    }
    window.location.href = '/profile'
  };

  return (
    <div className={styles.changePassword}>
      <h3 className='fw-bold'><Translate>Change Password Page :</Translate></h3>
      <form className='px-2'>
        <label htmlFor='password'><Translate>Current Password :</Translate></label>
        <input id='password' type='password' name='currentPassword' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <label htmlFor='newPassword'><Translate>New Password :</Translate></label>
        <input id='newPassword' type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor='confirmPassword'><Translate>Confirm New Password :</Translate></label>
        <input type='password' id='confirmPassword' name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button onClick={handleEditPassword}><Translate>An Editing</Translate></button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ChangePassword;

