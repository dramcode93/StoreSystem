import React, { useState, useEffect, useCallback } from "react";
import FormText from "../../form/FormText";
import FormNumber from "../../form/FormNumber";
import { useI18nContext } from "../context/i18n-context";
import FormInput from "../../form/FormInput";
import FormSelect from "../../form/FormSelect";
import axios from "axios";
import CustomersTable from "./CustomersTable";
import AddCustomer from "./AddCustomer";
import UpdateCustomer from "./UpdateCustomer";

const Customers = ({ role }) => {
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
