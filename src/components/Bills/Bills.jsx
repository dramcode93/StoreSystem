import React, { useState } from "react";
import BillsTable from "./BillsTable";
import CreateBills from "./forms/createBills";
import UpdateBills from "./forms/UpdateBills";

export default function Bills({ role }) {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedBillData, setSelectedCategoryData] = useState({});
  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };
  const toggleOpenEditModal = (selectedBill) => {
    setOpenEdit(!openEdit);
    setSelectedCategoryData(selectedBill);
  };
  return (
    <div className="text-white">
      <CreateBills
        closeModal={toggleOpenCreateModal}
        modal={openCreate}
        role={role}
      />
      <UpdateBills
        closeModal={toggleOpenEditModal}
        modal={openEdit}
        role={role}
        billData={selectedBillData}
      />
      <BillsTable
        openCreate={toggleOpenCreateModal}
        openEdit={toggleOpenEditModal}
      />
    </div>
  );
}
