import React from 'react'
import { Translate } from 'translate-easy';
import './Logout.css'
import { jwtDecode } from 'jwt-decode';
const LogOut = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);

  const handle = () => {
    localStorage.removeItem('token');
    window.location.href = '/'
  }
  return (
    <div>
    <div className='userName'>
  <Translate>User Name :</Translate> {decodedToken.name}  
    </div>
      <button className='LogOutBtn' onClick={handle}>
        <Translate>Log Out</Translate>
      </button>
    </div>
  )
}

export default LogOut
