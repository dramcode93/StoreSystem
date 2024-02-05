// import React, { useState } from 'react'
// import styles from './Profile.module.css'
// import axios from 'axios';
// const API_password = 'https://rich-blue-moth-slip.cyclic.app/api/users/updateMyPassword';

//      const ChangPassword  = () => {
//         const [currentPassword, setCurrentPassword] = useState('')  
//         const [Password, setPassword] = useState('')  
//         const [confirmPassword, setConfirmPassword] = useState('') 
//         const token= ("token");
//         const handleEditPassword = async (e) => {
//             e.preventDefault();
//             try {
//               const response = await axios.put(`${API_password}`, {
//                 currentPassword,
//                 Password,
//                 confirmPassword,
//               },{ headers: { Authorization: `Bearer ${token}` } });
//              console.log(response)
//             } catch (error) {
//               console.error('An error occurred while sending the reset password request', error);
//              }
//           };
        
        
//      return (
//       <div className={styles.changePassword}>
//       <h2>Change Password Page</h2>
//       <form>
//       <label htmlFor='password'>current Password :</label>
//                  <input id='password' type='password' name='currentPassword' value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)}/>
//       <label htmlFor='newPassword'>New Password :</label>
//       <input id='newPassword' type='password' name='password' value={Password} onChange={(e)=>setPassword(e.target.value)}/>
//       <label htmlFor='confirmPassword'>Confirm New Password :</label>
//       <input type='Password' id='confirmPassword' name='confirmPassword' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
//       <button onClick={handleEditPassword}>Edit</button>
//         </form>
//      </div>
//     )
// }

// export default ChangPassword

import React, { useState } from 'react';
import styles from './Profile.module.css';
import axios from 'axios';

const API_password = 'https://unusual-blue-button.cyclic.app/api/users/updateMyPassword';

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
      localStorage.setItem('token',response.data.token)
      console.log(response);
      
    } catch (error) {
      console.error('An error occurred while sending the reset password request', error);
      setError('Password change failed. Please check your inputs and try again.');
    }
    window.location.href='/profile'
  };

  return (
    <div className={styles.changePassword}>
      <h2>Change Password Page</h2>
      <form>
        <label htmlFor='password'>Current Password:</label>
        <input id='password' type='password' name='currentPassword' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <label htmlFor='newPassword'>New Password:</label>
        <input id='newPassword' type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor='confirmPassword'>Confirm New Password:</label>
        <input type='password' id='confirmPassword' name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button onClick={handleEditPassword}>Edit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ChangePassword;

