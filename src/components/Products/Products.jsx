import React, { useState  } from "react";
     import AddProduct from "./AddProduct";
import ProductsTable from "./ProductsTable";

 
const Products = ({role }) => {
   const [openCreate, setOpenCreate] = useState(false);

  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };
  return (
    <>
      <div>
        <AddProduct
        closeModal={toggleOpenCreateModal}
        modal={openCreate}
        role={role}
      />
      <ProductsTable openCreate={toggleOpenCreateModal} />
      </div>
    </>
  );
};

export default Products;
