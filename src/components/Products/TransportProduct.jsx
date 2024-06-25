import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useI18nContext } from "../context/i18n-context";
import FormNumber from "../../form/FormNumber";
import FormText from "../../form/FormText";
import { X } from "@phosphor-icons/react";
import FormSelect from "../../form/FormSelect";

function TransportProduct({ closeModal, role, modal, productData }) {
  //   const { id } = useParams();

  const [transportQuantity, setTransportQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [token] = useState(Cookies.get("token"));
  const { t, language } = useI18nContext();
  const [branches, setBranches] = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [fromBranch, setFromBranch] = useState("");
  const [toBranch, setToBranch] = useState("");
  const [subShops, setSubShops] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "https://store-system-api.gleeze.com/api/subShops/list?sort=name&fields=name",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const fetchedBranches = response.data.data;
          setAllBranches(fetchedBranches);
          //   setBranches(fetchedBranches);
        } catch (error) {
          console.error("Error fetching branches data:", error);
        }
      }
    };
    fetchBranches();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          productData &&
          productData.subShops &&
          productData.subShops.length > 0
        ) {
          setSubShops(productData.subShops);
          const branchesData = productData.subShops.map((shop) => ({
            _id: shop.subShop,
            name:
              allBranches.find((branch) => branch._id === shop.subShop)?.name ||
              "Unknown Branch",

            quantity: shop.quantity,
          }));
          setBranches(branchesData);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token, productData, modal, allBranches]);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://store-system-api.gleeze.com/api/products/${productData._id}/transportQuantity`,
        {
          from: fromBranch,
          to: toBranch,
          quantity: transportQuantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      closeModal();
      window.location.href = "/products";
    } catch (error) {
      console.error("Error transport quantity:", error);
    }
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
              <h3 className="text-xl font-bold mr-3 text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear">
                Transport Product
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
              onSubmit={handleUpdateProduct}
              className="fs-6 tracking-wider mt-4 p-0 gap-4 grid-cols-2"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <FormSelect
                selectLabel="From Branch"
                headOption="Select Branch"
                handleChange={(e) => setFromBranch(e.target.value)}
                options={branches.map((branch) => ({
                  value: branch._id,
                  label: (
                    <span>
                      {branch.name}{" "}
                      <span style={{ color: "red" }}>
                        Quantity: {branch.quantity}
                      </span>
                    </span>
                  ),
                }))}
                value={fromBranch}
                name="fromBranch"
              />

              <FormSelect
                selectLabel="To Branch"
                headOption="Select Branch"
                handleChange={(e) => setToBranch(e.target.value)}
                options={allBranches.map((branch) => ({
                  value: branch._id,
                  label: branch.name,
                }))}
                value={toBranch}
                name="toBranch"
              />
              <FormNumber
                label=" Quantity"
                name="quantity"
                value={transportQuantity}
                onChange={(e) => {
                  setTransportQuantity(e.target.value);
                }}
                placeholder="Quantity"
              />

              <div className="col-span-2 flex justify-center">
                <button
                  disabled={!toBranch || !fromBranch || !transportQuantity}
                  className="secondaryBtn w-1/2 h-12 rounded-md  fw-bold text-xl "

                >
                  Edit Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransportProduct;
