import React, { useState } from "react";
import { useI18nContext } from "../context/i18n-context";
import CreateUser from "./CreateUser";
import UserTable from "./UserTable";
import UpdateUser from "./UpdateUser";

const User = ({ role }) => {
  const { t, language } = useI18nContext();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState({});

  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };
  const toggleOpenEditModal = (selectedUser) => {
    setOpenEdit(!openEdit);
    setSelectedUserData(selectedUser);
  };
  return (
    <div>
      <CreateUser
        closeModal={toggleOpenCreateModal}
        modal={openCreate}
        role={role}
      />
      <UpdateUser
        closeModal={toggleOpenEditModal}
        modal={openEdit}
        role={role}
        userData={selectedUserData}
      />
      <UserTable
        openCreate={toggleOpenCreateModal}
        openEdit={toggleOpenEditModal}
      />
    </div>
  );
};

export default User;
