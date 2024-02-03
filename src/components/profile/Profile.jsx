import React, { useState } from 'react';
import LogOut from '../LogOut/LogOut';
import AsideBar from './AsideBar';
import MainComponent from './mainComponent';
import styles from './Profile.module.css'
const Profile = () => {
  const [selectedPage, setSelectedPage] = useState('information');

  const handlePageSelect = (page) => {
    setSelectedPage(page);
  };

  return (
    <div>
      <LogOut />
      <div className={styles.profileContainer}>
        <div>
          <AsideBar onSelect={handlePageSelect} />
          <MainComponent selectedPage={selectedPage} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
