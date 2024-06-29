import React, { useState } from 'react'
import AddressLoggedUser from './AddressLoggedUser';
import Information from './Information';

export const UserInfo = ({role}) => {

    const [openAdd, setOpenAdd] = useState(false);

    const toggleOpenCreateModal = () => {
        setOpenAdd(!openAdd);
    };

    return (
        <div>
            <AddressLoggedUser closeModal={toggleOpenCreateModal} modal={openAdd} />
            <Information role={role}  openAdd={toggleOpenCreateModal} />

        </div>
    )
}
