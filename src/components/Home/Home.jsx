import React from 'react'
import './Home.css'
import {  FaCannabis, FaChevronCircleRight, FaCloudMeatball, FaUbuntu, FaUser } from 'react-icons/fa';
import { Translate } from 'translate-easy';
// import chart1 from '../../Images/download (2).png'
// import chart2 from '../../Images/download (1).png'
import image1 from '../../Images/Dark Orange Modern Circle Diagram Graph (1).svg'
import image2 from '../../Images/Dark Orange Modern Circle Diagram Graph (2).svg'
import image3 from '../../Images/Dark Orange Modern Circle Diagram Graph.svg'
import { Link } from 'react-router-dom';
import LogOut from '../LogOut/LogOut';
const Home = () => {
  return (
    <div>
      <LogOut/>
    <div className='marginHome'>
    <div className='cards grid'>
        <Link to='category' className='card1 back1'>
            <div className='flex text1'>
           <div>
          <h2>135</h2>
         <span><Translate>Category</Translate></span>
           </div>
           <FaCannabis className='productLogo' /> 

            </div>
            <div className='details1 border2'>  <Translate>Details</Translate> <FaChevronCircleRight /></div>
        </Link>

        <Link to='products' className='card1 back2'>
            <div className='flex text1'>
            <div>
            <h2>65</h2>
            <span><Translate>products</Translate></span>
            </div>
            <FaUbuntu className='productLogo' /> 

            </div>
            <div className='details2 border2'>  <Translate>Details</Translate> <FaChevronCircleRight /></div>
        </Link>

        <Link to='bills' className='card1 back3'>
            <div className='flex text1'>
            <div>
            <h2><Translate>44</Translate></h2>
            <span><Translate>bills</Translate></span>
            </div>
            <FaCloudMeatball className='productLogo' /> 

            </div>
            <div className='details3 border2'>  <Translate>Details</Translate> <FaChevronCircleRight /></div>
        </Link>

        <Link to='customer' className='card1 back4'>
            <div className='flex text1'>
            <div>
            <h2>87</h2>
            <span><Translate>customer</Translate></span>
            </div>
            <FaUser className='productLogo' /> 

            </div>
            <div className='details4 border2'> <Translate>Details</Translate> <FaChevronCircleRight /></div>
        </Link>
        
    </div>
    <div className='flex charts fw-bold fs-5 font'>
    {/* <img src={chart1} alt='chart'/>
    <img src={chart2} alt='chart'/> */}
    <div>
      <img src={image2} alt='' className='mt-4'/>
      <p className=' chartBack1'><Translate>CERAMIC</Translate></p>
    </div>
   <div>
   <img src={image1} alt='' className='mt-4'/>
   <p className=' chartBack2'><Translate>SANITARY WARE</Translate> </p>
    </div>
   <div>
     <img src={image3} alt='' className='mt-4'/>
     <p className=' chartBack3'><Translate>LECICO</Translate></p>
    </div>
    </div>
    </div>
    </div>

  )
}

export default Home