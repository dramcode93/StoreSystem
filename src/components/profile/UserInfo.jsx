import React, { useState } from 'react'
import { useI18nContext } from "../context/i18n-context";
import AddressLoggedUser from './AddressLoggedUser';
import Information from './Information';

export const UserInfo = () => {
    const { t, language } = useI18nContext();

    const [openAdd, setOpenAdd] = useState(false);

    const toggleOpenCreateModal = () => {
        setOpenAdd(!openAdd);
    };

    return (
        <div>
            <AddressLoggedUser closeModal={toggleOpenCreateModal} modal={openAdd} />
            <Information openAdd={toggleOpenCreateModal} />

        </div>
    )
}
