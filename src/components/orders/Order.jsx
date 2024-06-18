import React, { useState } from "react";
import OrdersTable from "./OrdersTable";
import UpdateOrder from "./forms/updateOrder";

export default function Order({ role }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedOrderData, setSelectedOrderData] = useState({});
    const [selectedAssistantData, setSelectedAssistantData] = useState({});
    const [openPreview, setOpenPreview] = useState(false);


    const toggleOpenEditModal = (selectedOrder) => {
        setOpenEdit(!openEdit);
        setSelectedOrderData(selectedOrder);
    };

    const toggleOpenPreviewModal = (selectedAssistant) => {
        setSelectedAssistantData(selectedAssistant);
        setOpenPreview(!openPreview);
    };
    return (
        <div className="text-white">

            <UpdateOrder
                closeModal={toggleOpenEditModal}
                modal={openEdit}
                role={role}
                OrderData={selectedOrderData}
            />
            <OrdersTable
                openEdit={toggleOpenEditModal}
                openPreview={toggleOpenPreviewModal}
            />
        </div>
    );
}
