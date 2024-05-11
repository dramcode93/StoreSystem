import React, { useState } from "react";
import CustomersTable from "./CustomersTable";
import AddCustomer from "./AddCustomer";
import UpdateCustomer from "./UpdateCustomer";
import PreviewCustomer from "./PreviewCustomer";

const Customers = ({ role }) => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCustomerData, setSelectedCustomerData] = useState({});
  const [selectedAssistantData, setSelectedAssistantData] = useState({});
  const [openPreview, setOpenPreview] = useState(false);


  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };
  const toggleOpenEditModal = (selectedCustomer) => {
    setOpenEdit(!openEdit);
    setSelectedCustomerData(selectedCustomer);
  };
  const toggleOpenPreviewModal = (selectedAssistant) => {
    setSelectedAssistantData(selectedAssistant);
    setOpenPreview(!openPreview);
  };
  return (
    <div>
      {openPreview && (
        <PreviewCustomer
          closeModal={toggleOpenPreviewModal}
          assistantData={selectedAssistantData}
        />
      )}
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
        openPreview={toggleOpenPreviewModal}
      />
    </div>
  );
};

export default Customers;
