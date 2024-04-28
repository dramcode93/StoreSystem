import React, { useState } from "react";
import AddProduct from "./AddProduct";
import ProductsTable from "./ProductsTable";
import UpdateProduct from "./updateProduct";

const Products = ({ role }) => {
  const [openCreate , setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };
  const toggleOpenEditModal = (selectedProduct) => {
    setOpenEdit(!openEdit);
    // setSelectedProductData(selectedProduct);
  };
               
  return (
    <>
      <div>


        <AddProduct
          closeModal={toggleOpenCreateModal}
          modal={openCreate}
          role={role}
          
        />
        <UpdateProduct
        closeModal={toggleOpenEditModal}
        modal={openEdit}
        role={role}
        />
        <ProductsTable openCreate={toggleOpenCreateModal} />
      </div>
    </>
  );
};

export default Products;
