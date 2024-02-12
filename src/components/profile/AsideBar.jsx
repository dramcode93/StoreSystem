import React from 'react'
import styles from '../profile/Profile.module.css'
import { Translate } from 'translate-easy'
const AsideBar = ({ onSelect }) => {
  return (
    <div className={styles.AsideBar}>
      <div>
        <button onClick={() => onSelect('information')} className='my-4'><Translate>the Information</Translate></button>
        <button onClick={() => onSelect('changePassword')}><Translate>Change Password</Translate></button>
      </div>
    </div>
  )
}

export default AsideBar
