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
  const [selectedSubShop, setSelectedSubShop] = useState("");
  const [subShops, setSubShops] = useState([]);

  const transactionOptions = [
    { value: "withdraw", label: t(`Shop.Withdraw`) },
    { value: "deposit", label: t(`Shop.Deposit`)  },
  ];

  const handleTransaction = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://store-system-api.gleeze.com/api/financialTransactions",
        {
          money: money,
          transaction: transaction,
          reason: reason,
          subShop: selectedSubShop, // Include the selected sub shop ID in the payload
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("transaction successfully:", response.data);
      closeModal();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleSubShopChange = async (event) => {
    const value = event.target.value;
    setSelectedSubShop(value);
  };

  useEffect(() => {
    const fetchSubShops = async () => {
      try {
        const response = await axios.get(
          "https://store-system-api.gleeze.com/api/subShops/list?sort=name&fields=name",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubShops(response.data.data);
      } catch (error) {
        console.error("Failed to fetch sub shops:", error);
      }
    };

    fetchSubShops();
  }, []);

  return (
    <>
      <div
        onClick={handleBackgroundClick}
        className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
          fixed top-1/2 -translate-x-1/2 -translate-y-1/2
          z-50 justify-center items-center ${
            modal ? "-right-1/2" : "-left-[100%]"
          }
           w-full h-full `}
      >
        <div
          className={`w-full max-w-min 
             sideModal duration-200 ease-linear
             ${
               language === "ar"
                 ? "absolute left-0 rounded-r-xl"
                 : "absolute right-0 rounded-l-xl"
             }
             h-screen overflow-y-auto overflow-x-hidden`}
        >
          <div className="relative p-4 sideModal sm:p-5">
            <div
              dir="rtl"
              className="flex justify-between items-center w-full pb-4  rounded-t border-b sm:mb-5 dark:border-gray-600"
            >
              <h3 className="text-xl font-bold mr-3 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear">
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
                label={t(`Shop.Money`)}
                name="Money"
                value={money}
                onChange={(e) => {
                  setMoney(e.target.value);
                }}
                placeholder={t(`Shop.EnterAmount`)}
              />
              <FormText
                label={t(`Shop.Reason`)}
                name="Reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                }}
                placeholder={t(`Shop.Reason`)}
              />
              <FormSelect
                selectLabel={t(`Shop.Transaction`)}
                headOption={t(`Shop.Transaction`)}
                handleChange={(e) => setTransaction(e.target.value)}
                options={transactionOptions}
                value={transaction}
                name="transaction"
              />
              <div>
                <FormSelect
                  selectLabel={t("Sales.subShop")}
                  headOption={t("Sales.SelectAnOption")}
                  options={subShops.map((shop) => ({
                    value: shop._id,
                    label: shop.name,
                  }))}
                  handleChange={handleSubShopChange}
                  value={selectedSubShop}
                />
              </div>
              <div className="col-span-2 flex justify-center">
                <button
                  disabled={
                    !money || !transaction || !reason || !selectedSubShop
                  }
                  className="secondaryBtn w-96 h-12 rounded-md  fw-bold text-xl "
                >
                  {t(`Shop.Submit`)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
