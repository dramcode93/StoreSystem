 import { useState } from "react";
import CategoryTable from "./CategoryTable";
import CreateCategory from "./forms/CategoryForm";

export default function Category({ role }) {
    const [openCreate, setOpenCreate] = useState(false);

    const toggleOpenCreateModal = () => {
        setOpenCreate(!openCreate);
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
            />
        </div>
    );
}
