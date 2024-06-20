import React, { useState } from "react";
import CouponsTable from "./copounsTable";
import UpdateCoupon from "./forms/UpdateCopoun";

export default function Coupons({ role }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCouponData, setSelectedCouponData] = useState({});
    const [selectedAssistantData, setSelectedAssistantData] = useState({});
    const [openPreview, setOpenPreview] = useState(false);

 
    const toggleOpenEditModal = (selectedCoupon) => {
        setOpenEdit(!openEdit);
        setSelectedCouponData(selectedCoupon);
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
            <UpdateCoupon
                closeModal={toggleOpenEditModal}
                modal={openEdit}
                role={role}
                couponData={selectedCouponData}
            />
        </div>
    );
}
