import React from 'react'
  import styles from '../profile/Profile.module.css'
const AsideBar = ({ onSelect }) => {
    return (
        <div className={styles.AsideBar}>
        <div>
        <button onClick={() => onSelect('information')} className='my-3'>Information</button>
        <button onClick={() => onSelect('changePassword')}>Change Password</button>
      </div>
      </div>
    )
}

export default AsideBar
