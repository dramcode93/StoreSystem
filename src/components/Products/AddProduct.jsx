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
import ProductFormPreview from "./ProductFormPreview";
import { DeleteAlert, ErrorAlert, MaxImgAlert } from "../../form/Alert";

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
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchQuantities, setBranchQuantities] = useState({});

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Map branchQuantities to subShops array
      const subShops = Object.entries(branchQuantities).map(
        ([branchId, branchQuantity]) => ({
          subShop: branchId,
          quantity: parseInt(branchQuantity, 10), // Ensure branch quantity is an integer
        })
      );

      const totalBranchQuantity = subShops.reduce((total, subShop) => total + subShop.quantity, 0);

      if (totalBranchQuantity !== parseInt(quantity, 10)) {
        ErrorAlert({
          text: "Quantity of branches must be equal to total Quantity",
        });
        return;
      }

      console.log(totalBranchQuantity)

      // Make POST request to add product
      const response = await axios.post(
        "https://store-system-api.gleeze.com/api/products",
        {
          name: name,
          description: description,
          productPrice: parseInt(productPrice),
          sellingPrice: parseInt(sellingPrice),
          quantity: parseInt(quantity),
          category: category,
          subShops: subShops,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Product added successfully:", response.data);
      closeModal();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://store-system-api.gleeze.com/api/categories/list",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  });

  useEffect(() => {
    const fetchBranchesData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "https://store-system-api.gleeze.com/api/subShops/list?sort=name&fields=name",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const fetchedBranches = response.data.data;
          setBranches(fetchedBranches);
        } catch (error) {
          console.error("Error fetching branches data:", error);
        }
      }
    };
    fetchBranchesData();
  }, [token]);

  const handleBranchQuantityChange = (branchId, newQuantity) => {
    setBranchQuantities((prevBranchQuantities) => ({
      ...prevBranchQuantities,
      [branchId]: newQuantity,
    }));
  };

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
                value={name}
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
                label="Product Price"
                name="productPrice"
                onChange={(e) => {
                  setProductPrice(e.target.value);
                }}
                placeholder="Product Price"
                value={productPrice}
              />
              <FormNumber
                label="Selling Price"
                name="sellingPrice"
                onChange={(e) => {
                  setSellingPrice(e.target.value);
                }}
                placeholder="Selling Price"
                value={sellingPrice}
              />
              <FormNumber
                label="Total Quantity"
                name="Total quantity"
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
                placeholder="Total Quantity"
                value={quantity}
              />
              <FormTextArea
                label="Description"
                name="description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                placeholder="Description..."
                value={description}
              />
              {role === "admin" && (
                <>
                  <hr className="my-1 border-gray-300 w-full col-span-2" />
                  <p className="secondaryF text-xl col-span-2">
                    Branches quantities
                  </p>
                  {branches.map((branch) => (
                    <div key={branch._id} className="flex-1">
                      <FormNumber
                        label={`${branch.name} quantity`}
                        name={`quantity-${branch._id}`}
                        onChange={(e) =>
                          handleBranchQuantityChange(branch._id, e.target.value)
                        }
                        placeholder="Quantity"
                        value={branchQuantities[branch._id || ""]}
                      />
                    </div>
                  ))}
                </>
              )}
              <div className="col-span-2 flex justify-center">
                <button
                  disabled={
                    !name ||
                    !description ||
                    !category ||
                    !quantity ||
                    !productPrice ||
                    !sellingPrice ||
                    !branchQuantities
                  }
                  className="secondaryBtn w-1/2 h-12 rounded-md  fw-bold text-xl "
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
