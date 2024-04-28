import React, { useState, useEffect } from "react";
import {   useParams } from "react-router-dom";
import axios from "axios";
 import { Translate } from "translate-easy";
 import Cookies from "js-cookie";
import { useI18nContext } from "../context/i18n-context";
import FormNumber from "../../form/FormNumber";
import FormText from "../../form/FormText";
import { X } from "@phosphor-icons/react";
import FormSelect from "../../form/FormSelect";

function UpdateProduct({ closeModal, role, modal }) {
  const { id } = useParams();

  const [newProductName, setNewProductName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState(0);
  const [newProductPrice, setNewProductPrice] = useState(0);
  const [newSellingPrice, setNewSellingPrice] = useState(0);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [token] = useState(Cookies.get("token"));
  const { t, language } = useI18nContext();
  
  const API_category =
    "https://store-system-api.gleeze.com/api/categories/list";

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://store-system-api.gleeze.com/api/categories",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: productData } = await axios.get(
          `https://store-system-api.gleeze.com/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { data: categoriesData } = await axios.get(API_category, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNewProductName(productData.data.name);
        setNewProductPrice(productData.data.price);
        setNewProductQuantity(productData.data.quantity);
        setSelectedCategoryId(productData.data.category._id); // Set category ID
        setCategories(categoriesData.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    fetchCategories();
  }, [id, token]);

  const handleUpdateProduct = () => {
    axios
      .put(
        `https://store-system-api.gleeze.com/api/products/${id}`,
        {
          name: newProductName,
          productPrice: newProductPrice,
          sellingPrice: newSellingPrice,
          quantity: newProductQuantity,
          category: selectedCategoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        window.location.href = "/products";
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  if (isLoading) {
    return (
      <div>
        <Translate>Loading...</Translate>{" "}
      </div>
    );
  }

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
        absolute top-1/2 -translate-x-1/2 -translate-y-1/2
        z-50 justify-center items-center ${modal ? "left-1/2" : "-left-[100%]"}
         bg-opacity-40 w-full h-full `}
      >
        <div
          className={`CreateCenter w-full max-w-min 
           dark:bg-gray-800 rounded-r-xl duration-200 ease-linear
           ${modal ? "absolute left-0" : "absolute -left-[100%]"}
           h-screen overflow-auto`}
        >
          <div className="relative p-4 dark:bg-gray-800 sm:p-5">
            <div
              dir="rtl"
              className="flex justify-between items-center w-full pb-4  rounded-t border-b sm:mb-5 dark:border-gray-600"
            >
              <h3 className="text-xl font-bold mr-3 text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear">
                Add Product
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
              <FormText
                label="Name"
                name="name"
                onChange={(e) => {
                  setNewProductName(e.target.value);
                }}
                placeholder="Name"
              />

              <FormSelect
                selectLabel="Category"
                headOption="Select Category"
                handleChange={(e) => setNewCategory(e.target.value)}
                options={categories.map((category) => ({
                  value: category._id,
                  label: category.name,
                }))}
                value={category}
                name="Category"
              />
              <FormNumber
                label="Quantity"
                name="quantity"
                onChange={(e) => {
                  setNewProductQuantity(e.target.value);
                }}
                placeholder="Quantity"
              />
              <FormNumber
                label="Product Price"
                name="productPrice"
                onChange={(e) => {
                  setNewProductPrice(e.target.value);
                }}
                placeholder="Product Price"
              />
              <FormNumber
                label="Selling Price"
                name="sellingPrice"
                onChange={(e) => {
                  setNewSellingPrice(e.target.value);
                }}
                placeholder="Selling Price"
              />
              <div className="col-span-2 flex justify-center">
                <button
                  disabled={
                    !newProductName ||
                    !newCategory ||
                    !newProductQuantity ||
                    !newProductPrice ||
                    !newSellingPrice
                  }
                  className="bg-yellow-900 w-1/2 h-12 rounded-md hover:bg-yellow-800 fw-bold text-xl"
                >
                  {t("Products.AddProduct")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
