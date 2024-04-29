import React, { useState } from "react";
import CategoryTable from "./CategoryTable";
import CreateCategory from "./forms/CategoryForm";
import UpdateCategory from "./forms/Update";

export default function Category({ role }) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState( '');

    const toggleOpenCreateModal = () => {
        setOpenCreate(!openCreate);
    };

    const toggleOpenEditModal = (category) => {
        setSelectedCategory(category); // Set the selected category
        setOpenEdit(!openEdit);
    };

    const handleCategoryUpdate = (updatedCategory) => {
         setCategories((prevCategories) =>
            prevCategories.map((category) =>
                category._id === updatedCategory._id ? updatedCategory : category
            )
        );
    };

    return (
        <div className="text-white">
            <CreateCategory
                closeModal={toggleOpenCreateModal}
                modal={openCreate}
                role={role}
            />
            <CategoryTable
                openCreate={toggleOpenCreateModal}
                openEdit={toggleOpenEditModal} // Pass the function to open edit modal
                handleCategoryUpdate={handleCategoryUpdate} // Pass the function to handle category update
            />
            {selectedCategory && (
                <UpdateCategory
                    closeModal={toggleOpenEditModal}
                    modal={openEdit}
                    role={role}
                    category={selectedCategory}
                    updateCategory={handleCategoryUpdate} // Pass the function to update category
                />

            )}
        </div>
    );
}
