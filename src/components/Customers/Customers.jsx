import React, { useState, useEffect, useCallback } from "react";
import FormText from "../../form/FormText";
import FormNumber from "../../form/FormNumber";
import { useI18nContext } from "../context/i18n-context";
import FormInput from "../../form/FormInput";
import FormSelect from "../../form/FormSelect";
import axios from "axios";
import CustomersTable from "./CustomersTable";
import AddCustomer from "./AddCustomer";

const Customers = ({ role }) => {
  const { t, language } = useI18nContext();

  const [openCreate, setOpenCreate] = useState(false);

  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };
  return (
    <div>
      <AddCustomer
        closeModal={toggleOpenCreateModal}
        modal={openCreate}
        role={role}
      />
      <CustomersTable openCreate={toggleOpenCreateModal} />
    </div>
  );
};

export default Customers;
