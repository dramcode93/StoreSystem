import React, { useState } from "react";
import BillsTable from "./BillsTable";
import CreateBills from "./forms/createBills";

export default function Bills({ role }) {
    const [openCreate, setOpenCreate] = useState(false);

    const toggleOpenCreateModal = () => {
        setOpenCreate(!openCreate);
    };

    return (
        <div className="text-white">
            <CreateBills
                closeModal={toggleOpenCreateModal}
                modal={openCreate}
                role={role}
            />
            <BillsTable openCreate={toggleOpenCreateModal} />
        </div>
    );
}
