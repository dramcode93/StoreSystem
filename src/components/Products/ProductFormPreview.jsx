import { useCallback, useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import FormPic from "../../form/FormPic";
import ConfirmationModal from "../Category/ConfirmationModel";
import { MaxImgAlert } from "../../form/Alert";

export default function ProductFormPreview({ details, t, headers }) {
  const token = Cookies.get("token");
  const [images, setImages] = useState("");
  const [loading, setLoading] = useState(true);
  // const [showConfirmation, setShowConfirmation] = useState(false);
  // const [selectedImage, setSelectedImage] = useState();
  const [specificProduct, setSpecificProduct] = useState();
  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const product = await axios.get(
          `https://store-system-api.gleeze.com/api/categories/${details.category._id}/products/${details._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSpecificProduct(product.data.data);
        // console.log("specific", product.data.data);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error specific data:", error);
    } finally {
      setLoading(false);
    }
  }, [token, details]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleDelete = useCallback(
    async (imgUrl) => {
      const imageName = imgUrl.split("/products/").pop();
      setLoading(true);
      try {
        const response = await axios.delete(
          `https://store-system-api.gleeze.com/api/products/${details._id}/images`,
          {
            headers: { Authorization: `Bearer ${token}` },
            data: { images: imageName },
          }
        );
        // console.log("Response:", response.data);
        // console.log("Image deleted successfully!", imageName);
        fetchData();
        setLoading(false);
        // window.location.href = "/products";
      } catch (error) {
        // setLoading(false);
        console.error("Error deleting image:", error);
      }
    },
    [token, details, fetchData]
  );

  const handleImageUpload = (e) => {
    // Get the files from the event and limit to maximum 5 files
    const newFiles = Array.from(e.target.files).slice(
      0,
      5 - details.images.length
    );
    setImages((prevFiles) => {
      const totalFiles =
        prevFiles.length + newFiles.length + details.images.length;

      if (details.images.length >= 5) {
        // If details.images.length is already 5, don't accept additional images
        MaxImgAlert({ title: "Oops...", text: "Maximum 5 images allowed" });
        return prevFiles;
      } else if (totalFiles <= 5) {
        return [...prevFiles, ...newFiles];
      } else {
        MaxImgAlert({ title: "Oops...", text: "Maximum 5 images allowed" });
        // const remainingSpace = 5 - details.images.length;
        // return [...prevFiles, ...newFiles.slice(0, remainingSpace)];
        return prevFiles;
      }
    });
  };

  const addImages = async (e) => {
    try {
      if (images) {
        const formData = new FormData();
        images.forEach((file, index) => {
          formData.append("images", file);
        });
        setLoading(true);
        
        const response = await axios.put(
          `https://store-system-api.gleeze.com/api/products/${details._id}/images`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Image added successfully:", response.data);
        setImages([]);
        fetchData();
        setLoading(false);

        // window.location.href = "/products";
      }
    } catch (error) {
      console.error("Error adding Image:", error);
    }
  };
  // const cancelDelete = useCallback(() => {
  //   setShowConfirmation(false);
  // }, []);
  // const handleDeleteImage = (imageUrl) => {
  //   setShowConfirmation(true);
  //   setSelectedImage(imageUrl);
  // };


  console.log("object",details)
  return (
    <dl className="">
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* <ConfirmationModal
            item="Image"
            show={showConfirmation}
            onCancel={cancelDelete}
            onConfirm={() => {
              handleDelete();
              setShowConfirmation(false);
            }}
          /> */}
          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none secondaryF">
              {headers?.code} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {specificProduct?._id.slice(-4)}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none secondaryF d-flex">
              {headers?.name} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {specificProduct?.name}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none secondaryF d-flex">
              {headers?.description} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {specificProduct?.description}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none secondaryF d-flex">
              {headers?.category} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {specificProduct?.category.name}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none secondaryF d-flex">
              {headers?.quantity} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {specificProduct?.quantity}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none secondaryF d-flex">
              {headers?.productPrice} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {specificProduct?.productPrice}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none secondaryF d-flex">
              {headers?.sellingPrice} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {specificProduct?.sellingPrice}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-3 font-semibold leading-none secondaryF d-flex">
              {headers?.sold} :
            </dt>
            <dd className="mb-3 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {specificProduct?.sold}
            </dd>
          </div>
          <div className="">
            <dt className="mb-3 font-semibold leading-none secondaryF">
              {headers?.subShop} :
            </dt>
            {details?.subShops?.length > 0 ? (
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xm text-gray-50 dark:text-gray-200 uppercase">
                      <tr className="text-center fs-6 bg-gray-700   tracking-wide  transition ease-out duration-200">
                        <th scope="col" className="px-4 py-3">
                          Branch
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.subShops.map((item, index) => (
                        <tr
                          key={index}
                          className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-600 hover:bg-opacity-25 transition ease-out duration-200"
                        >
                          <td className="px-4 py-3">{item?.subShop.name}</td>
                          <td className="px-4 py-3">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="d-flex gap-1">
                    <td
                      colSpan="4"
                      className="!text-base font-light  sm:mb-5 secondaryF"
                    >
                      No products yet
                    </td>
                  </div>
                )}
          </div>

          {/* <div className="d-flex gap-2 items-center">
              <dt className=" font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
                {headers?.images}:
              </dt>
              <dd className=" font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                {details.images && details.images.length > 0 ? (
                  <div className="d-grid grid-cols-1 gap-1 ">
                    {details.images.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt="Product"
                        className="max-w-full h-20"
                        crossOrigin="anonymous"
                      />
                    ))}
                  </div>
                ) : (
                 <div className="d-flex ">
                 No Images Yet
                 </div>
                )}
              </dd>
            </div> */}

          <div className="">
            <dt className=" font-semibold leading-none secondaryF d-flex my-3">
              {headers?.images}:
            </dt>
            <dd className="mb-0 font-light text-gray-500 sm:mb-5 dark:text-gray-400 d-flex gap-2 items-center">
              {specificProduct.images && specificProduct.images?.length > 0 ? (
                <div className="d-grid grid-cols-5 m-0 gap-2 ">
                  {specificProduct.images?.map((imageUrl, index) => (
                    <div key={index} className="d-flex mb-2 ">
                    <img
                        src={imageUrl}
                        alt="Product"
                        className="max-w-full h-20 rounded-md"
                        crossOrigin="anonymous"
                      />
                      <button
                        className=""
                        onClick={() => handleDelete(imageUrl)}
                      >
                        <FaTrash size={18} color="red" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="d-flex items-center ">No Images Yet</div>
              )}
            </dd>
            {/* <dd className="mb-0 font-light text-gray-500 sm:mb-5 dark:text-gray-400 d-flex gap-2 items-center">
              {loading ? (
                <Loading />
              ) : specificProduct.images &&
                specificProduct.images.length > 0 ? (
                <div className="d-grid grid-cols-5 m-0 gap-4 ">
                  {specificProduct.images.map((imageUrl, index) => (
                    <div key={index} className="d-flex ">
                      <img
                        src={imageUrl}
                        alt="Product"
                        className="max-w-full h-20 rounded-md"
                        crossOrigin="anonymous"
                      />
                      <button
                        className=""
                        onClick={() => handleDelete(imageUrl)}
                      >
                        <FaTrash size={18} color="red" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="d-flex items-center ">No Images Yet</div>
              )}
            </dd> */}
          </div>
          <div className="d-flex items-center justify-center mt-2 gap-5">
            <FormPic
              label="Upload Images"
              name="Upload Images"
              onChange={handleImageUpload}
              placeholder="Product Image"
            />
            <button
              type="button"
              onClick={addImages}
              className=" h-min rounded-md secondaryBtn font-medium text-xl max-w-60"
            >
              Add Images
            </button>
          </div>
          {images.length > 0 && (
            <div className="d-flex gap-2 items-center justify-center mt-2">
              {images.map((file, index) => (
                <div key={index}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Uploaded ${index + 1}`}
                    className="w-40 h-20 rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </dl>
  );
}
