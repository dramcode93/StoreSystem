import React from 'react'
import styles from '../profile/Profile.module.css'
import { Translate } from 'translate-easy'
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom';

const AsideBar = ({ onSelect }) => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);

  return (
    <div className={styles.AsideBar}>
      <div>
        <button onClick={() => onSelect('information')} className='my-3'><Translate>the Information</Translate></button>
        <button onClick={() => onSelect('changePassword')}><Translate>Change Password</Translate></button>
        {decodedToken.role !== 'user' &&
          <Link to= '/Profile/Users' className='mt-3'><Translate>Users</Translate></Link>
        }

      </div>
    </div>
  )
}

export default AsideBar
