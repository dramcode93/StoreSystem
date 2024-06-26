import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Loading from "../Loading/Loading";
import { useI18nContext } from "../context/i18n-context";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "../../form/Alert";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import "./styles.css";
import BlackLogo from "../Navbar/logo/Black-and-Gold-Sophisticated-Traditional-Fashion-Logo-(1).svg";

const Shops = () => {
  const API_URL = "https://store-system-api.gleeze.com/api/shops";
  const API_URL_Type = "https://store-system-api.gleeze.com/api/shopTypes/list";
  const [shops, setShops] = useState([]);
  const [shopTypes, setShopTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const token = Cookies.get("token");
  const { t, language } = useI18nContext();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const typeFilter = selectedType ? `type=${selectedType}` : "";
      const query = `sort=name&search=${searchTerm}&${typeFilter}`;
      const productsResponse = await axios.get(`${API_URL}?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShops(productsResponse.data.data);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching data");
      ErrorAlert({
        text: error.response?.data?.message || "Error fetching data",
      });
    } finally {
      setLoading(false);
    }
  }, [token, searchTerm, selectedType]);

  const fetchShopTypes = useCallback(async () => {
    try {
      const typesResponse = await axios.get(API_URL_Type, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShopTypes(typesResponse.data.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching shop types");
      ErrorAlert({
        text: error.response?.data?.message || "Error fetching shop types",
      });
    }
  }, [token]);

  useEffect(() => {
    fetchData();
    fetchShopTypes();
  }, [fetchData, fetchShopTypes]);

  const handleTypeChange = (typeId) => {
    setSelectedType(typeId);
  };

  return (
    <div className="flex">
      <section
        className={` mx-10 p-10 absolute top-32 -z-50 w-3/4  ${language === "ar" ? "left-10" : "right-10"
          }`}
      >
        <div>
          {loading ? (
            <div className="fs-4 text-center mb-5 pb-3 text-gray-500 dark:text-gray-400">
              <Loading />
            </div>
          ) : (
            <>
              {shops.length === 0 ? (
                <p className="text-center text-gray-600 mt-5 text-xl">
                  No shops available for this type.
                </p>
              ) : (
                <div className="d-flex flex-wrap gap-6">
                  {shops.map((shop) => (
                    <div
                      className="d-flex-2 text-center border-2 secondary"
                      key={shop._id}
                      style={{
                        width: "320px",
                        boxShadow: "0 .3rem .5rem rgba(0, 0, 0, .1)",
                      }}
                    >
                      <img
                        src={shop?.image || BlackLogo}
                        alt={shop?.name}
                        crossOrigin="anonymous"
                        className="h-64 w-full object-cover bg-black"
                      />
                      <h3 className="secondaryF text-2xl capitalize mt-2">
                        {shop?.name}
                      </h3>
                      <p className="text-gray-600 text-lg mb-2">
                        {shop.type.length > 0
                          ? shop.type
                            .map((type) =>
                              language === "ar" ? type.type_ar : type.type_en
                            )
                            .join(" , ")
                          : "Doesn't have type"}
                      </p>
                      <button
                        onClick={() => {
                          navigate(`/shopProduct/${shop._id}`);
                        }}
                        className="secondaryBtn"
                      >
                        {t("Cart.VisitShop")}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <div
        className={`filter-container myColor w-60 absolute top-32 p-3  max-h-72 ${language === "ar"
          ? "-left-48 hover:left-0"
          : "-right-48 hover:right-0"
          }`}
        style={{
          height: "calc(100vh - 120px)",
          overflowY: "auto",
        }}
      >
        <div
          className={`flex w-full  ${language === "ar"
            ? "pr-10"
            : "pl-10"
            }`}
        >
          {language === "ar" ? (
            <IoIosArrowDropleft className="text-white text-2xl ml-2  absolute top-36 right-2" />
          ) : (
            <IoIosArrowDropright className="text-white text-2xl mr-2 absolute top-36 left-2" />
          )}

          <div className="relative">
            <h3 className="font-bold text-white text-xl mb-3">
              {t("Cart.FilterType")}
            </h3>
            <table className="w-2/3">
              <tbody>
                <tr className="d-flex gap-2 ">
                  <td className={`cursor-pointer mb-2  `}>
                    <input
                      type="radio"
                      name="typeFilter"
                      id="all"
                      checked={selectedType === null}
                      onChange={() => handleTypeChange(null)}
                    />
                  </td>
                  <td className="mb-2">
                    <label className="text-white" htmlFor="all">
                      {t("Cart.All")}{" "}
                    </label>
                  </td>
                </tr>
                {shopTypes.map((type) => (
                  <tr key={type._id} className="d-flex gap-2">
                    <td className="cursor-pointer mb-2">
                      <input
                        type="radio"
                        name="typeFilter"
                        id={type.type_en}
                        checked={type._id === selectedType}
                        onChange={() => handleTypeChange(type._id)}
                      />
                    </td>
                    <td>
                      <label
                        className="text-white text-capitalize mb-2"
                        htmlFor={type.type_en}
                      >
                        {language === "ar" ? type.type_ar : type.type_en}
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shops;
