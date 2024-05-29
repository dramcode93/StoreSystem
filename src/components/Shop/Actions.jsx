import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
import FormNumber from "../../form/FormNumber";
import axios from "axios";
import Cookies from "js-cookie";
import FormText from "../../form/FormText";
import FormSelect from "../../form/FormSelect";

export default function Actions({ closeModal, modal }) {
  useEffect(() => {}, []);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const { t, language } = useI18nContext();
  const token = Cookies.get("token");
  const [money, setMoney] = useState("");
  const [reason, setReason] = useState("");
  const [transaction, setTransaction] = useState("");

  const transactionOptions = [
    { value: "withdraw", label: "Withdraw" },
    { value: "deposit", label: "Deposit" },
  ];

  const handleTransaction = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://store-system-api.gleeze.com/api/financialTransactions",
        {
        money:money,
        transaction:transaction,
        reason:reason
          },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("transaction successfully:", response.data);
      closeModal();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  //   const fetchCategories = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://store-system-api.gleeze.com/api/categories/list",
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       setCategories(response.data.data);
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchCategories();
  //   }, []);
  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setImages(files);
  // };

  // AddProduct.js
  // Inside AddProduct component

  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files).slice(0, 5); // Limit to maximum 5 files
  //   setImages((prevFiles) => {
  //     const totalFiles = prevFiles.length + files.length;
  //     if (totalFiles <= 5) {
  //       return [...prevFiles, ...files];
  //     } else {
  //       const remainingSpace = 5 - prevFiles.length;
  //       const newFiles = files.slice(0, remainingSpace);
  //       return [...prevFiles, ...newFiles];
  //     }
  //   });
  // };

  //   const handleImageChange = (e) => {
  //     const files = Array.from(e.target.files).slice(0, 5); // Limit to maximum 5 files
  //     setImages((prevFiles) => {
  //       const totalFiles = prevFiles.length + files.length;
  //       if (totalFiles <= 5) {
  //         return [...prevFiles, ...files];
  //       } else {
  //         MaxImgAlert({ title: "Oops...", text: "Maximum 5 images allowed" }); // Display error alert
  //         // setImages("")
  //         return prevFiles; // Prevent adding more files
  //       }
  //     });
  //   };
  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files).slice(0, 5); // Limit to maximum 5 files
  //   setImages(files);
  // };

  //   <ProductFormPreview
  //     details={{
  //       _id: "",
  //       name,
  //       description,
  //       category: { name: category },
  //       quantity,
  //       productPrice,
  //       sellingPrice,
  //       sold: "",
  //       images: imageURLs,
  //     }}
  //     t={t}
  //     headers={{
  //       code: "Code",
  //       name: "Name",
  //       description: "Description",
  //       category: "Category",
  //       quantity: "Quantity",
  //       productPrice: "Product Price",
  //       sellingPrice: "Selling Price",
  //       sold: "Sold",
  //       images: "Images",
  //     }}
  //     loading={false}
  //   />;

  return (
    <>
      <div
        onClick={handleBackgroundClick}
        className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
        fixed top-1/2 -translate-x-1/2 -translate-y-1/2
        z-50 justify-center  items-center ${
          modal ? "-right-1/2" : "-left-[100%]"
        }
         bg-opacity-40 w-full h-full `}
      >
        <div
          className={`w-full max-w-min 
           bg-gray-800  rounded-r-xl duration-200 ease-linear
           ${language === "ar" ? "absolute left-0" : "absolute right-0"}
           h-screen overflow-auto`}
        >
          <div className="relative p-4 dark:bg-gray-800 sm:p-5">
            <div
              dir="rtl"
              className="flex justify-between items-center w-full pb-4  rounded-t border-b sm:mb-5 dark:border-gray-600"
            >
              <h3 className="text-xl font-bold mr-3 text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear">
                {t(`Shop.Actions`)}      
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
            <form
              onSubmit={handleTransaction}
              className="fs-6 tracking-wider mt-4 p-0 gap-4 grid-cols-2"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <FormNumber
                label="Money"
                name="Money"
                value={money}
                onChange={(e) => {
                  setMoney(e.target.value);
                }}
                placeholder="Enter amount"
              />
              <FormText
                label="Reason"
                name="Reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                }}
                placeholder="Enter reason"
              />
              <FormSelect
                selectLabel="Transaction"
                headOption="Select transaction"
                handleChange={(e) => setTransaction(e.target.value)}
                options={transactionOptions}
                value={transaction}
                name="transaction"
              />

              <div className="col-span-2 flex justify-center">
                <button
                  disabled={!money || !transaction || !reason}
                  className="bg-yellow-900 w-1/2 h-12 rounded-md hover:bg-yellow-800 fw-bold text-xl"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
