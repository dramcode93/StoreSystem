import { useI18nContext } from "../../context/i18n-context";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { X } from "@phosphor-icons/react";
import BillsFormPreview from "./BillsFormPreview";

export default function PreviewBill({ closeModal, assistantData }) {
  const { t } = useI18nContext();
  const [loading, setLoading] = useState(false);
// console.log("assistantData",assistantData)
  const detailsData = {
    code: assistantData._id.slice(-4),
    name: assistantData.customer.name ,
    userName: assistantData.user.name,
    products: assistantData.products,
    totalAmount: assistantData.totalAmountAfterDiscount,
    paidAmount: assistantData.paidAmount,
    remainingAmount: assistantData.remainingAmount,
    discount: assistantData.discount,
  };
  const headers = {
    code: "Bill Code",
    name: "Customer Name",
    sellerName: "Seller Name",
    products: "Products",
    totalAmount: "Total Amount",
    paidAmount: "Paid Amount",
    remainingAmount: "Remaining Amount",
    discount:"Discount",
  };

  
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  return (
    <div
      onClick={handleBackgroundClick}
      className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
    fixed top-1/2 -translate-x-1/2 -translate-y-1/2
    z-50 justify-center items-center left-1/2
      w-full h-full `}
    >
      <div
        className={`PreviewUser max-w-2xl 
        rounded-2xl duration-200 ease-linear
       absolute top-2/3 sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-full
       min-h-screen overflow-auto sideModal `}
      >
        <div className="relative sideModal sm:p-5">
          <div
            dir="rtl"
            className="flex justify-between items-center w-full mb-3 rounded "
          >
            <button
              type="button"
              onClick={closeModal}
              className="w-fit text-gray-400 bg-transparent hover:bg-gray-200 
              hover:text-gray-900 rounded-lg text-sm p-1.5 mr-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <X size={18} weight="bold" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div
            className={`  mx-auto text-center
              myColor p-1 mb-4`}
          >
            <h3 className="font-semibold mb-0 py-1 text-white">{t("previewForm.title")}</h3>
          </div>
          <BillsFormPreview t={t} details={detailsData} headers={headers} />
        </div>
      </div>
    </div>
  );
}
