import React, { useState } from "react";
import CategoryTable from "./CategoryTable";
import CreateCategory from "./forms/CategoryForm";
import UpdateCategory from "./forms/Update";
import PreviewCategory from "./forms/PreviewCategory";

export default function Category({ role }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState({});
  const [selectedAssistantData, setSelectedAssistantData] = useState({});
  const [openCreate, setOpenCreate] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };
  const toggleOpenEditModal = (selectedCategory) => {
    setOpenEdit(!openEdit);
    setSelectedCategoryData(selectedCategory);
  };

  const toggleOpenPreviewModal = (selectedAssistant) => {
    setSelectedAssistantData(selectedAssistant);
    setOpenPreview(!openPreview);
  };
  
  return (
    <div className="text-white">
      {openPreview && (
        <PreviewCategory
          closeModal={toggleOpenPreviewModal}
          assistantData={selectedAssistantData}
        />
      )}
      <CreateCategory
        closeModal={toggleOpenCreateModal}
        modal={openCreate}
        role={role}
      />
      <UpdateCategory
        closeModal={toggleOpenEditModal}
        modal={openEdit}
        role={role}
        categoryData={selectedCategoryData}
      />
      <CategoryTable
        openCreate={toggleOpenCreateModal}
        openEdit={toggleOpenEditModal}
        openPreview={toggleOpenPreviewModal}
        role={role}
      />
    </div>
  );
}
