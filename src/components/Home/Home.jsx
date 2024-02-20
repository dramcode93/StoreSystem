import React from 'react'
import './Home.css'
import {  FaCannabis, FaChevronCircleRight, FaCloudMeatball, FaUbuntu, FaUser } from 'react-icons/fa';
import { Translate } from 'translate-easy';
import image1 from '../../Images/Dark Orange Modern Circle Diagram Graph (1).svg'
import image2 from '../../Images/Dark Orange Modern Circle Diagram Graph (2).svg'
import image3 from '../../Images/Dark Orange Modern Circle Diagram Graph.svg'
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import LogOut from '../LogOut/LogOut';
import MainComponent from '../Aside/MainComponent';
const Home = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  return (
    <div>
      <LogOut/>

      <MainComponent />
    <div className='marginHome'>
    <div className='cards grid'>
    {decodedToken.role!=="manager" &&
    <>
    <Link to='/category' className='card1 back1'>
        <div className='flex text1'>
        <div>
      <h2>135</h2>
      <span><Translate>Category</Translate></span>
        </div>
        <FaCannabis className='productLogo' /> 

        </div>
        <div className='details1 border2'>  <Translate>Details</Translate> <FaChevronCircleRight /></div>
    </Link>

    <Link to='/products' className='card1 back2'>
        <div className='flex text1'>
        <div>
        <h2>65</h2>
        <span><Translate>products</Translate></span>
        </div>
        <FaUbuntu className='productLogo' /> 

        </div>
        <div className='details2 border2'>  <Translate>Details</Translate> <FaChevronCircleRight /></div>
    </Link>

    <Link to='/bills' className='card1 back3'>
        <div className='flex text1'>
        <div>
        <h2><Translate>44</Translate></h2>
        <span><Translate>bills</Translate></span>
        </div>
        <FaCloudMeatball className='productLogo' /> 

        </div>
        <div className='details3 border2'>  <Translate>Details</Translate> <FaChevronCircleRight /></div>
    </Link>
</>
  }
    <Link to='/profile' className='card1 back4'>
        <div className='flex text1'>
        <div>
        <h2>87</h2>
        <span><Translate>the Profile</Translate></span>
        </div>
        <FaUser className='productLogo' /> 

        </div>
        <div className='details4 border2'> <Translate>Details</Translate> <FaChevronCircleRight /></div>
    </Link>
    
    </div>
    </div>
    </div>

  )
}

export default Home