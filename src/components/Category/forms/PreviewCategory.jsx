import { TrashSimple, X } from "@phosphor-icons/react";
import FormPreview from "../../../components/form/FormPreview";
import { useI18nContext } from "../../../context/i18n-context";
import {  differenceInYears } from "date-fns";
 
export default function PreviewCategory({ closeModal, assistantData }) {
     const { t } = useI18nContext();

    console.log(assistantData);

    const birthDate = assistantData.birthDate ? new Date(assistantData.birthDate) : null;
    const today = new Date();
    const age = birthDate ? differenceInYears(today, "05 03 2001") : null;

    const detailsData = [
        {
            head: `${t("previewForm.assistantsDetails.userName")} :`,
            value: assistantData.username || "لم يتم تحديده",
        },
        {
            head: `${t("previewForm.assistantsDetails.email")} :`,
            value: assistantData.email || "لم يتم تحديده",
        },
        {
            head: `${t("previewForm.assistantsDetails.gender")} :`,
            value: assistantData.gender || "لم يتم تحديده",
        },

        {
            head: `${t("previewForm.assistantsDetails.age")} :`,
            value:
                assistantData.age !== null
                    ? `${age} ${t("previewForm.assistantsDetails.years")}`
                    : "لم يتم تحديده",
        },
        {
            head: `${t("previewForm.assistantsDetails.role")} :`,
            value: assistantData.role || "لم يتم تحديده",
        },
        {
            head: `${t("previewForm.assistantsDetails.phone")} :`,
            value: assistantData.phone || "لم يتم تحديده",
        },

        {
            head: `${t("previewForm.assistantsDetails.nationalId")} :`,
            value: assistantData.nationalId || "لم يتم تحديده",
        },
    ];

    return (
        <div>
             <div
                className={`overflow-y-auto overflow-x-hidden 
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        z-50 justify-center items-center
        w-full h-full bg-black bg-opacity-40`}
            >
                <div
                    className="PreviewUser absolute top-2/3 sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 w-full max-w-2xl pb-10"
                    dir="rtl"
                >
                     <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                         <div className="flex justify-end mb-4 rounded-t sm:mb-5">
                            <div>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    <X size={18} weight="bold" className="w-5 h-5" />
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                        </div>
                        <div
                            className={`text-lg text-white bg-themeColor md:text-xl mx-auto text-center
               dark:text-white dark:bg-themeColor p-2 mb-5 rounded-md `}
                        >
                            <h3 className="font-semibold ">{t("previewForm.title")}</h3>
                        </div>
                        <FormPreview
                            t={t}
                            details={detailsData}                           
                        />
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    className="gap-2 text-white inline-flex items-center justify-center bg-themeColor
                   hover:bg-orange-700 focus:ring-4 focus:outline-none duration-100 ease-linear
                   focus:ring-primary-300 font-medium rounded-lg text-sm px-5 
                   py-2.5 text-center dark:focus:ring-themeColor"
                                >
                                    <span className="font-bold text-base">{t("previewForm.assistantsDetails.edit")}</span>
                                </button>
                            </div>
                            <button
                                type="button"
                                className="gap-2 inline-flex items-center 
                text-white bg-red-600 hover:bg-red-700 
                focus:ring-4 focus:outline-none 
                focus:ring-red-300 font-medium duration-100 ease-linear
                rounded-lg text-sm px-5 py-2.5 text-center 
                dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                            >
                                <TrashSimple size={18} weight="bold" />
                                <span className="font-bold text-base">
                                    {t("previewForm.assistantsDetails.delete")} </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
