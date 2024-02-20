import React from 'react'
import Information from './Information';
import ChangPassword from './ChangPassword';
import Users from './Users';
const  AllComponent = ({ selectedPage }) => {
    return (
        <div>
        <div>
        {selectedPage === 'information' && <Information />}
        {selectedPage === 'changePassword' && <ChangPassword />}
        {selectedPage === 'users' && <Users />}
      </div>
        </div>
    )
}

export default AllComponent
