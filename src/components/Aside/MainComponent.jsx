import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'translate-easy';
import './styles.css';
import { FaBars } from 'react-icons/fa';
import LogoImage from '../../Images/Modern Creative Technology Logo.svg'
const MainComponent = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className={`main-container ${showSidebar ? 'show-sidebar' : ''}`}>
    <div className={`sidebar ${showSidebar ? 'show-sidebar' : ''}`}>
    <button className={`toggle-button ${showSidebar ? 'show-toggle' : ''}`} onClick={toggleSidebar}>
      <FaBars />
    </button>
        <div className="logo-container">
         <img src={LogoImage} alt=''/>
        </div>
        <div className="nav-links">
          <Link to="/home">
            <Translate>Main Page</Translate>
          </Link>
          <Link to="/category">
            <Translate>categories</Translate>
          </Link>
          <Link to="/products">
            <Translate>Products</Translate>
          </Link>
          <Link to="/bills">
            <Translate>Bills</Translate>
          </Link>
          <Link to="/customer">
            <Translate>Customers</Translate>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
