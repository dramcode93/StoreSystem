import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
import FormNumber from "../../form/FormNumber";
import axios from "axios";
import Cookies from "js-cookie";
import FormText from "../../form/FormText";
import FormSelect from "../../form/FormSelect";
import FormTextArea from "../../form/FormTextArea";
import FormPic from "../../form/FormPic";

export default function AddProduct({ closeModal, role, modal }) {
  useEffect(() => {}, []);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const { t, language } = useI18nContext();
  const token = Cookies.get("token");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState("");
  const [categories, setCategories] = useState([]);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("productPrice", productPrice);
      formData.append("sellingPrice", sellingPrice);
      formData.append("quantity", quantity);
      formData.append("category", category);

      images.forEach((file, index) => {
        formData.append("images", file);
      });

      const response = await axios.post(
        "https://store-system-api.gleeze.com/api/products",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Product added successfully:", response.data);

      // Check if response.data.images is defined before mapping over it
      if (response.data.images) {
        // Extract image URLs from response and store them
        const uploadedImageURLs = response.data.images.map(
          (image) => image.url
        );
        setImages(uploadedImageURLs);
      }

      closeModal();
    } catch (error) {
      console.error("Error adding Product:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://store-system-api.gleeze.com/api/categories",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setImages(files);
  // };

// AddProduct.js
// Inside AddProduct component

const handleImageChange = (e) => {
  const files = Array.from(e.target.files).slice(0, 5); // Limit to maximum 5 files
  setImages(prevFiles => {
    const totalFiles = prevFiles.length + files.length;
    if (totalFiles <= 5) {
      return [...prevFiles, ...files];
    } else {
      const remainingSpace = 5 - prevFiles.length;
      const newFiles = files.slice(0, remainingSpace);
      return [...prevFiles, ...newFiles];
    }
  });
};

  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files).slice(0, 5); // Limit to maximum 5 files
  //   setImages(files);
  // };
  

  return (
    <>
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
              onSubmit={handleAddProduct}
              className="fs-6 tracking-wider mt-4 p-0 gap-4 grid-cols-2"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <FormText
                label="Name"
                name="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Name"
              />
              <FormSelect
                selectLabel="Category"
                headOption="Select Category"
                handleChange={(e) => setCategory(e.target.value)}
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
                  setQuantity(e.target.value);
                }}
                placeholder="Quantity"
              />
              <FormNumber
                label="Product Price"
                name="productPrice"
                onChange={(e) => {
                  setProductPrice(e.target.value);
                }}
                placeholder="Product Price"
              />
              <FormTextArea
                label="Description"
                name="description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                placeholder="Description..."
              />
              <FormNumber
                label="Selling Price"
                name="sellingPrice"
                onChange={(e) => {
                  setSellingPrice(e.target.value);
                }}
                placeholder="Selling Price"
              />
              <FormPic
                label="Upload Picture"
                name="Upload Picture"
                onChange={handleImageChange}
                placeholder="Product Picture"
                fileList={images}
              />
              <div className="col-span-2 flex justify-center">
                <button
                  disabled={
                    !name ||
                    !description ||
                    !category ||
                    !quantity ||
                    !productPrice ||
                    !sellingPrice
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
    </>
  );
}
