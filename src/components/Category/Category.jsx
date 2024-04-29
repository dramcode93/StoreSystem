import { useState } from "react";
import CategoryTable from "./CategoryTable";
import CreateCategory from "./forms/CategoryForm";
import UpdateCategory from "./forms/Update";

export default function Category({ role }) {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState({});
  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };
  const toggleOpenEditModal = (selectedCategory) => {
    setOpenEdit(!openEdit);
    setSelectedCategoryData(selectedCategory);
  };

  return (
    <div className="text-white">
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
      />
    </div>
  );
}