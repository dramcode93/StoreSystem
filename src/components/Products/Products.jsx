import React, { useState } from "react";
import AddProduct from "./AddProduct";
import ProductsTable from "./ProductsTable";
import UpdateProduct from "./updateProduct";
import PreviewProduct from "./PreviewProduct";

const Products = ({ role }) => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState({});
  const [selectedAssistantData, setSelectedAssistantData] = useState({});
  const [openPreview, setOpenPreview] = useState(false);

  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };
  const toggleOpenEditModal = (selectedProduct) => {
    setOpenEdit(!openEdit);
    setSelectedProductData(selectedProduct);
  };
  const toggleOpenPreviewModal = (selectedAssistant) => {
    setSelectedAssistantData(selectedAssistant);
    setOpenPreview(!openPreview);
  };
  return (
    <>
          {openPreview && (
        <PreviewProduct
          closeModal={toggleOpenPreviewModal}
          assistantData={selectedAssistantData}
        />
      )}
        <AddProduct
          closeModal={toggleOpenCreateModal}
          modal={openCreate}
          role={role}
        />
        <UpdateProduct
          closeModal={toggleOpenEditModal}
          modal={openEdit}
          role={role}
          productData={selectedProductData}
        />
        <ProductsTable
          openEdit={toggleOpenEditModal}
          openCreate={toggleOpenCreateModal}
          openPreview={toggleOpenPreviewModal}
        />
    </>
  );
};

export default Products;
