import React, { useState} from "react";
import CustomersTable from "./CustomersTable";
import AddCustomer from "./AddCustomer";
import UpdateCustomer from "./UpdateCustomer";

const Customers = ({ role }) => {

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
      <AddCustomer
        closeModal={toggleOpenCreateModal}
        modal={openCreate}
        role={role}
      />
      <UpdateCustomer
        closeModal={toggleOpenEditModal}
        modal={openEdit}
        role={role}
        customerData={selectedCustomerData}
      />
      <CustomersTable
        openCreate={toggleOpenCreateModal}
        openEdit={toggleOpenEditModal}
      />
    </div>
  );
};

export default Customers;
