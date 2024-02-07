import React from 'react'
import Information from './Information';
import ChangPassword from './ChangPassword';
const  AllComponent = ({ selectedPage }) => {
    return (
        <div>
        <div>
        {selectedPage === 'information' && <Information />}
        {selectedPage === 'changePassword' && <ChangPassword />}
      </div>
        </div>
    )
}

export default AllComponent
