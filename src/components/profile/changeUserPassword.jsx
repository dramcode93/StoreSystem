import React, { useState } from 'react';
import styles from './Profile.module.css';
import axios from 'axios';
import { Translate } from 'translate-easy';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const ChangeUserPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const { id } = useParams(); // Extract id from useParams
    const API_password1 = `https://store-system-api.gleeze.com/api/users/changeUserPassword/${id}`;
    let token = Cookies.get("token");

    const handleEditPassword = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const response = await axios.put(`${API_password1}`, {
                password: password, // Use newPassword instead of password
                passwordConfirmation,
            }, { headers: { Authorization: `Bearer ${token}` } });
            window.location.href = '/profile';

        } catch (error) {
            console.error('An error occurred while sending the reset password request', error);
            setError('Password change failed. Please check your inputs and try again.');
        }
    };

    return (
        <div className={styles.changePassword}>
            <h3 className='fw-bold'><Translate>Change Password Page :</Translate></h3>
            <form className='px-2'>
                <label htmlFor='newPassword'><Translate>New Password :</Translate></label>
                <input id='newPassword' type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor='confirmPassword'><Translate>Confirm New Password :</Translate></label>
                <input type='password' id='confirmPassword' name='passwordConfirmation' value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
                <button onClick={handleEditPassword}><Translate>An Editing</Translate></button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ChangeUserPassword;
