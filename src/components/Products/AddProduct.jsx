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
  const [images, setImages] = useState("");
  const [categories, setCategories] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchQuantities, setBranchQuantities] = useState({});

  // const handleAddProduct = async (e) => {
  //   e.preventDefault();

  // // Validate total branch quantity
  // const quantitiesArray = Object.values(branchQuantities);
  // const totalBranchQuantity = quantitiesArray.reduce((total, quantity) => total + parseInt(quantity, 10), 0);

  // if (totalBranchQuantity !== parseInt(quantity, 10)) {
  //   ErrorAlert({
  //     title: "Quantity Mismatch",
  //     text: "The sum of branch quantities must equal the total quantity.",
  //   });
  //   return; // Prevent form submission
  // }

  //   try {
  //     const formData = new FormData();
  //     formData.append("name", name);
  //     formData.append("description", description);
  //     formData.append("productPrice", productPrice);
  //     formData.append("sellingPrice", sellingPrice);
  //     formData.append("quantity", parseInt(quantity, 10)); // Ensure quantity is an integer
  //     formData.append("category", category);
  //     images.forEach((file) => {
  //       formData.append("images", file);
  //     });

  //   // Map branchQuantities to subShops array
  //   const subShops = Object.entries(branchQuantities).map(
  //     ([branchId, branchQuantity]) => ({
  //       subShop: branchId,
  //       quantity: parseInt(branchQuantity, 10), // Ensure branch quantity is an integer
  //     })
  //   );

  //   // Append subShops data to formData as JSON string
  //   formData.append("subShops", JSON.stringify(subShops));

  //   // Log FormData content (for debugging)
  //   for (let [key, value] of formData.entries()) {
  //     console.log(`${key}:`, value);
  //   }
  //     const response = await axios.post(
  //       "https://store-system-api.gleeze.com/api/products",
  //       formData,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     console.log("Product added successfully:", response.data);
  //     if (response.data.images) {
  //       const uploadedImageURLs = response.data.images.map(
  //         (image) => image.url
  //       );
  //       setImageURLs(uploadedImageURLs);
  //     }

  //     closeModal();
  //   } catch (error) {
  //     console.error("Error adding product:", error);
  //   }
  // };
  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Validate total branch quantity
    // const quantitiesArray = Object.values(branchQuantities);
    // const totalBranchQuantity = quantitiesArray.reduce((total, quantity) => total + parseInt(quantity, 10), 0);

    // if (totalBranchQuantity !== parseInt(quantity, 10)) {
    //   ErrorAlert({
    //     title: "Quantity Mismatch",
    //     text: "The sum of branch quantities must equal the total quantity.",
    //   });
    //   return; // Prevent form submission
    // }

    try {
      // const formData = new FormData();
      // formData.append("name", name);
      // formData.append("description", description);
      // formData.append("productPrice", productPrice);
      // formData.append("sellingPrice", sellingPrice);
      // formData.append("quantity", parseInt(quantity, 10)); // Ensure quantity is an integer
      // formData.append("category", category);

      // // Append images to formData
      // if(images){
      //   images.forEach((file) => {
      //     formData.append("images", file);
      //   });
      // }

      // Map branchQuantities to subShops array
      const subShops = Object.entries(branchQuantities).map(
        ([branchId, branchQuantity]) => ({
          subShop: branchId,
          quantity: parseInt(branchQuantity, 10), // Ensure branch quantity is an integer
        })
      );

      // console.log(subShops);
      // console.log(JSON.stringify(subShops));
      // // Append subShops data to formData as JSON string
      // formData.append("subShops", JSON.stringify(subShops));

      // // Log FormData content (for debugging)
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }
      // console.log(formData);

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
      if (response.data.images) {
        const uploadedImageURLs = response.data.images.map(
          (image) => image.url
        );
        setImageURLs(uploadedImageURLs);
      }

      closeModal(); // Close modal after successful submission
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Limit to maximum 5 files
    setImages((prevFiles) => {
      const totalFiles = prevFiles.length + files.length;
      if (totalFiles <= 5) {
        return [...prevFiles, ...files];
      } else {
        MaxImgAlert({ title: "Oops...", text: "Maximum 5 images allowed" }); // Display error alert
        // setImages("")
        return prevFiles; // Prevent adding more files
      }
    });
  };
  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files).slice(0, 5); // Limit to maximum 5 files
  //   setImages(files);
  // };

  <ProductFormPreview
    details={{
      _id: "",
      name,
      description,
      category: { name: category },
      quantity,
      productPrice,
      sellingPrice,
      sold: "",
      images: imageURLs,
    }}
    t={t}
    headers={{
      code: "Code",
      name: "Name",
      description: "Description",
      category: "Category",
      quantity: "Quantity",
      productPrice: "Product Price",
      sellingPrice: "Selling Price",
      sold: "Sold",
      images: "Images",
    }}
    loading={false}
  />;

  useEffect(() => {
    const fetchUserData = async () => {
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
    fetchUserData();
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
         bg-opacity-40 w-full h-full `}
      >
        <div
          className={`w-full max-w-min 
           dark:bg-gray-800 rounded-r-xl duration-200 ease-linear
           ${language === "ar" ? "absolute left-0" : "absolute right-0"}
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
              <FormTextArea
                label="Description"
                name="description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                placeholder="Description..."
                value={description}
              />
              {/* <FormPic
                label="Upload Picture"
                name="Upload Picture"
                onChange={handleImageChange}
                placeholder="Product Picture"
                fileList={images}
              />

              {images.length > 0 && (
                <div className="d-flex gap-2">
                  {images.map((file, index) => (
                    <div key={index}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded ${index + 1}`}
                        className="max-w-full h-10"
                      />
                    </div>
                  ))}
                </div>
              )} */}
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
