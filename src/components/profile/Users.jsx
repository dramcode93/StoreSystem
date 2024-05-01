import React, { useState } from 'react'
import { useI18nContext } from "../context/i18n-context";
import CreateUser from './CreateUser';
import UserTable from './UserTable';

const User = ({ role }) => {
    const { t, language } = useI18nContext();

    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCustomerData, setSelectedCustomerData] = useState({});

    const toggleOpenCreateModal = () => {
        setOpenCreate(!openCreate);
    };
    const toggleOpenEditModal = (selectedCustomer) => {
        setOpenEdit(!openEdit);
        setSelectedCustomerData(selectedCustomer);
    };
    return (
        <div>
            <CreateUser closeModal={toggleOpenCreateModal}
                modal={openCreate}
                role={role} />

            <UserTable openCreate={toggleOpenCreateModal} />
        </div>
    )
}

export default User;
