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
import FormTextArea from "../../form/FormTextArea";

function UpdateProduct({ closeModal, role, modal, productData }) {
  const { id } = useParams();

  const [newProductName, setNewProductName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  // const [newProductQuantity, setNewProductQuantity] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newSellingPrice, setNewSellingPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token] = useState(Cookies.get("token"));
  const { t, language } = useI18nContext();

  const API_category =
    "https://store-system-api.gleeze.com/api/categories/list";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const { data: productData } = await axios.get(
        //   `https://store-system-api.gleeze.com/api/products/${id}`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );

        const { data: categoriesData } = await axios.get(API_category, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // setNewProductName(productData.data.name);
        // setNewProductPrice(productData.data.productPrice);
        // setNewSellingPrice(productData.data.sellingPrice);
        // setNewProductQuantity(productData.data.quantity);
        // setSelectedCategoryId(productData.data.category._id); // Set category ID
        setCategories(categoriesData.data);

        if (modal && productData) {
          setNewProductName(productData.name);
          setNewCategory(productData.category?._id);
          // setNewProductQuantity(productData.quantity);
          setNewProductPrice(productData.productPrice);
          setNewSellingPrice(productData.sellingPrice);
          setNewDescription(productData.description);
          setIsLoading(false);
        }
        setIsLoading(false);
        // console.log('categoriesData',categoriesData.data)
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
      await axios.put(
        `https://store-system-api.gleeze.com/api/products/${productData._id}`,
        {
          name: newProductName,
          productPrice: newProductPrice,
          sellingPrice: newSellingPrice,
          category: newCategory,
          description:newDescription
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
                Edit Product
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
                <FormText
                  label="Name"
                  name="name"
                  value={newProductName}
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
                  value={newCategory}
                  name="Category"
                />
                {/* <FormNumber
                label=" Total Quantity"
                name="quantity"
                value={newProductQuantity}
                onChange={(e) => {
                  setNewProductQuantity(e.target.value);
                }}
                placeholder="Quantity"
              /> */}
                <FormNumber
                  label="Product Price"
                  name="productPrice"
                  value={newProductPrice}
                  onChange={(e) => {
                    setNewProductPrice(e.target.value);
                  }}
                  placeholder="Product Price"
                />
                <FormNumber
                  label="Selling Price"
                  name="sellingPrice"
                  value={newSellingPrice}
                  onChange={(e) => {
                    setNewSellingPrice(e.target.value);
                  }}
                  placeholder="Selling Price"
                />
                <FormTextArea
                  label="Description"
                  name="description"
                  onChange={(e) => {
                    setNewDescription(e.target.value);
                  }}
                  placeholder="Description..."
                  value={newDescription}
                />
                <div className="col-span-2 flex justify-center">
                  <button
                    disabled={
                      !newProductName ||
                      !newCategory ||
                      !newProductPrice ||
                      !newSellingPrice
                    }
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

export default UpdateProduct;
