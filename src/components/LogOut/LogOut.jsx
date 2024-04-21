import React from 'react'
 import './Logout.css'
 import Cookies from 'js-cookie';
import { User } from '@phosphor-icons/react';
const LogOut = () => {
     const handle = () => {
    Cookies.remove('token');
    window.location.href = '/'
  }
  return (
    <div>
      <User color="gray"  size={25} /> 
      <button className='LogOutBtn' onClick={handle}>
      </button>
    </div>
  )
}

export default LogOut

