import React, { useState } from "react";
import CouponsTable from "./copounsTable";
import UpdateCoupon from "./forms/UpdateCopoun";
import CreateCoupon from "./forms/CreateCopouns";

export default function Coupons({ role }) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCouponData, setSelectedCouponData] = useState({});
    const [selectedAssistantData, setSelectedAssistantData] = useState({});
    const [openPreview, setOpenPreview] = useState(false);

    const toggleOpenCreateModal = () => { 
        setOpenCreate(!openCreate);
      };
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
                openCreate={toggleOpenCreateModal}
            />
            <UpdateCoupon
                closeModal={toggleOpenEditModal}
                modal={openEdit}
                role={role}
                couponData={selectedCouponData}
            />
            <CreateCoupon
                closeModal={toggleOpenCreateModal}
                modal={openCreate}
                role={role}
            />
        </div>
    );
}
