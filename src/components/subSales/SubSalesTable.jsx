import React, { useState, useRef, useEffect } from "react";
import { useI18nContext } from "../context/i18n-context";
import FormSelect from "../../form/FormSelect";
import axios from "axios";
import Cookies from "js-cookie";

export default function SubSalesTable() {
  const [selectedSalesId, setSelectedSalesId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedSubShop, setSelectedSubShop] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);
  const [subShops, setSubShops] = useState([]);
  const token = Cookies.get("token");

  const dropdownRefs = useRef({});
  const { t, language } = useI18nContext();

  console.log(error);
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
  }, [token]);

  const handleSelectChange = async (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    await handleShowTable(value, selectedSubShop);
  };

  const handleSubShopChange = async (event) => {
    const value = event.target.value;
    setSelectedSubShop(value);

    if (selectedOption) {
      await handleShowTable(selectedOption, value);
    }
  };

  const handleShowTable = async (option, subShopId) => {
    const endpointMap = {
      day: "daily",
      month: "monthly",
      year: "yearly",
    };
    const endpoint = endpointMap[option];

    const url = `https://store-system-api.gleeze.com/api/subSales/${endpoint}?subShop=${subShopId}`;

    if (option && subShopId) {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.data && response.data.data.length > 0) {
          setSalesData(response.data.data);
        } else {
          setSalesData([]);
        }
        setError(null);
        document.getElementById("table").style.display = "table";
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setError("You are not logged in! Please log in to get access.");
      }
    }
  };

  const handleClickOutside = (event, SalesId) => {
    const dropdown = dropdownRefs.current[SalesId];

    if (
      dropdown &&
      !dropdown.contains(event.target) &&
      !event.target.classList.contains("edit-button")
    ) {
      setSelectedSalesId(null);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      handleClickOutside(event, selectedSalesId);
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [selectedSalesId]);

  // Updated formatDate function for dd-mm-yyyy format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div>
      <section
        className={`mx-10 rounded-md py-2 absolute top-32 -z-50 w-3/4 ${
          language === "ar" ? "left-10" : "right-10"
        }`}
      >
        <div className="mx-auto max-w-screen-xl">
          <div>
            <div className="h-36  secondary relative shadow-md d-flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 pb-8">
              <div className="w-full md:w-1/2">
                <form className="d-flex items-center ">
                  <div className="flex items-center justify-content-evenly gap-5 w-full sm:grid-cols-3">
                    <div className="min-w-full">
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
                    <div className="min-w-full">
                      <FormSelect
                        selectLabel={t("Sales.date")}
                        headOption={t("Sales.SelectAnOption")}
                        options={[
                          { value: "day", label: t("Sales.day") },
                          { value: "month", label: t("Sales.month") },
                          { value: "year", label: t("Sales.year") },
                        ]}
                        handleChange={handleSelectChange}
                        value={selectedOption}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {error && (
              <div className="bg-red-500 text-white p-4 rounded-md">
                {error}
              </div>
            )}
            <div
              className="overflow-x-auto w-100 mt-4 secondary relative shadow-md "
              id="table"
              style={{ display: "none" }}
            >
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xm text-gray-50 dark:text-gray-200 uppercase">
                  <tr className="text-center fs-6 bg-gray-700   tracking-wide  transition ease-out duration-200">
                    <th scope="col" className="px-5 py-4">
                      {t("Sales.Id")}
                    </th>
                    <th scope="col" className="px-5 py-4">
                      {t("Sales.date")}
                    </th>
                    <th scope="col" className="px-5 py-3">
                      {t("Sales.Earnings")}
                    </th>
                    <th scope="col" className="px-5 py-3">
                      {t("Sales.Sales")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.length > 0 ? (
                    salesData.map((sale, index) => (
                      <tr
                        key={index}
                        className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-600 hover:bg-opacity-25 transition ease-out duration-200"
                      >
                        <td className="px-5 py-3">{sale._id}</td>
                        <td className="px-5 py-3">
                          {formatDate(sale.createdAt)}
                        </td>
                        <td className="px-5 py-3">{sale.earnings}</td>
                        <td className="px-5 py-3">{sale.sales}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-600 hover:bg-opacity-25 transition ease-out duration-200">
                      <td className="px-5 py-3">-</td>
                      <td className="px-5 py-3">-</td>
                      <td className="px-5 py-3">0</td>
                      <td className="px-5 py-3">0</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}