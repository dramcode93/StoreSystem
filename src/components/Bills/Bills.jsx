import React, { useState } from "react";
import BillsTable from "./BillsTable";
import CreateBills from "./forms/createBills";
import UpdateBills from "./forms/UpdateBills";
import PreviewBill from "./forms/PreviewBills";

export default function Bills({ role }) {
  const [openCreate, setOpenCreate] = useState(false);
  // const [openEdit, setOpenEdit] = useState(false);
  const [selectedBillData, setSelectedCategoryData] = useState({});
  const [selectedAssistantData, setSelectedAssistantData] = useState({});

  const [openPreview, setOpenPreview] = useState(false);

  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };
  // const toggleOpenEditModal = (selectedBill) => {
  //   setOpenEdit(!openEdit);
  //   setSelectedCategoryData(selectedBill);
  // };
  const toggleOpenPreviewModal = (selectedAssistant) => {
    setSelectedAssistantData(selectedAssistant);
    setOpenPreview(!openPreview);
  };
  return (
    <div className="text-white">
          {openPreview && (
        <PreviewBill
          closeModal={toggleOpenPreviewModal}
          assistantData={selectedAssistantData}
        />
      )}
      <CreateBills
        closeModal={toggleOpenCreateModal}
        modal={openCreate}
        role={role}
      />
      {/* <UpdateBills
        closeModal={toggleOpenEditModal}
        modal={openEdit}
        role={role}
        billData={selectedBillData}
      /> */}
      <BillsTable
        openCreate={toggleOpenCreateModal}
        // openEdit={toggleOpenEditModal}
        openPreview={toggleOpenPreviewModal}
      />
    </div>
  );
}
