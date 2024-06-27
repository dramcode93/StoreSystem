import React, { useState } from "react";
import UpdateProduct from "../Products/updateProduct";

import TypesTable from "./TypesTable";
import AddType from "./AddType";
import EditType from "./EditType";


const ShopTypes = ({ role }) => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState({});

  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };
  const toggleOpenEditModal = (selectedProduct) => {
    setOpenEdit(!openEdit);
    setSelectedProductData(selectedProduct);
  };

  return (
    <>
      <AddType
        closeModal={toggleOpenCreateModal}
        modal={openCreate}
        role={role} 
      />
      <EditType
        closeModal={toggleOpenEditModal}
        modal={openEdit}
        role={role}
        typeData={selectedProductData}
      />
      <TypesTable
        openEdit={toggleOpenEditModal}
        openCreate={toggleOpenCreateModal}
      />
    </>
  );
};
 
export default ShopTypes;
