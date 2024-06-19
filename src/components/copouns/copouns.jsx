import React, { useState } from "react";
import CouponsTable from "./copounsTable";

export default function Category({ role }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCategoryData, setSelectedCategoryData] = useState({});
    const [selectedAssistantData, setSelectedAssistantData] = useState({});
    const [openPreview, setOpenPreview] = useState(false);

 
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
            <CouponsTable
                openEdit={toggleOpenEditModal}
                openPreview={toggleOpenPreviewModal}
            />
        </div>
    );
}
