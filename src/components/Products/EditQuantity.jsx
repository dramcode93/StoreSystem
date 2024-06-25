import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useI18nContext } from "../context/i18n-context";
import FormNumber from "../../form/FormNumber";
import FormText from "../../form/FormText";
import { X } from "@phosphor-icons/react";
import FormSelect from "../../form/FormSelect";
import Loading from "../Loading/Loading";

function UpdateProductQuantity({ closeModal, role, modal, productData }) {
  const { id } = useParams();

  const [selectedBranchQuantity, setSelectedBranchQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [token] = useState(Cookies.get("token"));
  const { t, language } = useI18nContext();
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [subShops, setSubShops] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      if (token) {
        try {
          setIsLoading(true);
          const response = await axios.get(
            "https://store-system-api.gleeze.com/api/subShops/list?sort=name&fields=name",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const fetchedBranches = response.data.data;
          // setAllBranches(fetchedBranches);
          setBranches(fetchedBranches);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching branches data:", error);
          setIsLoading(false);
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
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, token, productData, modal]);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateSubShopQuantity();
      closeModal();
      window.location.href = "/products";
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleBranchChange = (e) => {
    const selectedBranchId = e.target.value;
    setSelectedBranch(selectedBranchId);

    if (subShops) {
      const selectedBranchData = subShops.find(
        (shop) => shop.subShop === selectedBranchId
      );
      setSelectedBranchQuantity(
        selectedBranchData ? selectedBranchData.quantity : 0
      );
    }
  };

  const updateSubShopQuantity = async () => {
    try {
      await axios.put(
        `https://store-system-api.gleeze.com/api/products/${productData._id}/updateQuantity`,
        {
          subShops: {
            subShop: selectedBranch,
            quantity: selectedBranchQuantity,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error updating sub shop quantity:", error);
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
                Edit Product Quantity
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
            {isLoading ? (
              <Loading />
            ) : (
              <form
                onSubmit={handleUpdateProduct}
                className="fs-6 tracking-wider mt-4 p-0 gap-4 grid-cols-2"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                <FormSelect
                  selectLabel="Branch"
                  headOption="Select Branch"
                  handleChange={handleBranchChange}
                  options={branches.map((branch) => ({
                    value: branch._id,
                    label: branch.name,
                  }))}
                  value={selectedBranch}
                  name="Branch"
                />
                <FormNumber
                  label=" Selected Branch Quantity"
                  name="quantity"
                  value={selectedBranchQuantity}
                  onChange={(e) => {
                    setSelectedBranchQuantity(e.target.value);
                  }}
                  placeholder="Quantity"
                />
                <div className="col-span-2 flex justify-center">
                  <button
                    disabled={!selectedBranch || !selectedBranchQuantity}
                    className="secondaryBtn w-1/2 h-12 rounded-md  fw-bold text-xl "

                  >
                    Edit Product
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProductQuantity;
