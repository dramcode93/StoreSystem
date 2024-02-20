import React from 'react'
import { Translate } from 'translate-easy';
import './Logout.css'
const LogOut = () => {
    const handle=()=>{
        localStorage.removeItem('token'); 
        window.location.href='/'
    }
  return (
    <div>
     <button className='LogOutBtn' onClick={handle}>
    <Translate>Log Out</Translate> 
        </button> 
    </div>
  )
}

export default LogOut
