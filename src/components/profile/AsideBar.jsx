import React from 'react'
import { Link } from 'react-router-dom'
 import styles from '../profile/Profile.module.css'
const AsideBar = () => {
    return (
        <div className={styles.AsideBar}>
            <Link to='/Information'>Information</Link>
            <Link to='/ChangePassword'>Change password</Link>
        </div>
    )
}

export default AsideBar
