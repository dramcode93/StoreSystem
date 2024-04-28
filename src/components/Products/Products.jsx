import React, { useState } from "react";
import AddProduct from "./AddProduct";
import ProductsTable from "./ProductsTable";
import UpdateProduct from "./updateProduct";

const Products = ({ role }) => {
  const [openCreate , setOpenCreate] = useState(false);
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
<<<<<<< HEAD
        <ProductsTable
          openEdit={toggleOpenEditModal}
         openCreate={toggleOpenCreateModal}
         
         />
=======
        <ProductsTable openCreate={toggleOpenCreateModal} openEdit={toggleOpenEditModal} />
>>>>>>> f20c326f5d5adbd6361f6c61b2f689bc0d731da8
      </div>
    </>
  );
};

export default Products;
