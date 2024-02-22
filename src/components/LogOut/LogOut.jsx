import React from 'react'
import { Translate } from 'translate-easy';
import './Logout.css'
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
const LogOut = () => {
  const token = Cookies.get('token');
  const decodedToken = jwtDecode(token);

  const handle = () => {
    Cookies.remove('token');
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
