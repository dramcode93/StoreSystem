import React, { useState } from "react";
import OrdersTable from "./OrdersTable";
import OrderPreview from "./forms/orderPreview";

export default function Order({ role }) {
      const [selectedAssistantData, setSelectedAssistantData] = useState({});
    const [openPreview, setOpenPreview] = useState(false);
 

    const toggleOpenPreviewModal = (selectedAssistant) => {
        setSelectedAssistantData(selectedAssistant);
        setOpenPreview(!openPreview);
    };

    return (
        <div className="text-white">
            {openPreview && (
                <OrderPreview
                    closeModal={toggleOpenPreviewModal}
                    assistantData={selectedAssistantData}
                />
            )}
            <OrdersTable openPreview={toggleOpenPreviewModal} />
        </div>
    );
}
