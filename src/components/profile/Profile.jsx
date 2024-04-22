import React, { useState } from 'react';
import AsideBar from './AsideBar';
import AllComponent from './mainComponent';
import styles from './Profile.module.css'
import MainComponent from './../Aside/MainComponent';
const Profile = () => {
  const [selectedPage, setSelectedPage] = useState('information');

  const handlePageSelect = (page) => {
    setSelectedPage(page);
  };

  return (
    <div>
      <MainComponent />
      <div className={styles.profileContainer}>
        <div>
          <AsideBar onSelect={handlePageSelect} />
          <AllComponent selectedPage={selectedPage} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
