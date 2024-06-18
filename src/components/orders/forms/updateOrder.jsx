import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useI18nContext } from "../../context/i18n-context";
import FormText from "../../../form/FormText";
import { X } from "@phosphor-icons/react";

function UpdateOrder({ closeModal, role, modal, orderData = {} }) { 
    const token = Cookies.get("token");
    const [orderStatus, setOrderStatus] = useState(orderData.status || "");
    const { language } = useI18nContext();
    console.log("orderData", orderData);

    useEffect(() => {
        if ( orderData) {
            setOrderStatus(orderData.status);
        }
    }, [orderData, modal]);

    const handleUpdateOrderStatus = (status) => {
        const endpoint =
            status === "paid"
                ? `/api/order/${orderData._id}/pay`
                : `/api/order/${orderData._id}/deliver`;

        axios
            .put(
                `https://store-system-api.gleeze.com${endpoint}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                window.location.href = "/orders"; 
            })
            .catch((error) => {
                console.error(`Error updating order status to ${status}:`, error);
            });
    };

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div>
            <div
                onClick={handleBackgroundClick}
                className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
        fixed top-1/2 -translate-x-1/2 -translate-y-1/2
        z-50 justify-center items-center ${modal ? "-right-1/2" : "-left-[100%]"}
         bg-opacity-40 w-full h-full `}
            >
                <div
                    className={`w-full max-w-min 
           dark:bg-gray-800 rounded-r-xl duration-200 ease-linear
           ${language === 'ar' ? "absolute left-0" : "absolute right-0"}
           h-screen overflow-auto`}
                >
                    <div className="relative p-4 dark:bg-gray-800 sm:p-5">
                        <div
                            dir="rtl"
                            className="flex justify-between items-center w-full pb-4  rounded-t border-b sm:mb-5 dark:border-gray-600"
                        >
                            <h3 className="text-xl font-bold mr-3 text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear">
                                Update Order Status
                            </h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="w-fit text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 mr-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <X size={18} weight="bold" />
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <form className="fs-6 tracking-wider mt-4 p-0 gap-4 grid-cols-2" dir={language === "ar" ? "rtl" : "ltr"}>
                            <FormText
                                label="Status"
                                name="status"
                                value={orderStatus}
                                onChange={(e) => {
                                    setOrderStatus(e.target.value);
                                }}
                                placeholder="Order Status"
                            />
                            <div className="col-span-2 flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => handleUpdateOrderStatus("paid")}
                                    className="bg-green-600 w-1/2 h-12 rounded-md hover:bg-green-500 fw-bold text-xl mx-2"
                                >
                                    Mark as Paid
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleUpdateOrderStatus("delivered")}
                                    className="bg-blue-600 w-1/2 h-12 rounded-md hover:bg-blue-500 fw-bold text-xl mx-2"
                                >
                                    Mark as Delivered
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateOrder;
