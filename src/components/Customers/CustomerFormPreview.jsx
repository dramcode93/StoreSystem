import { useCallback, useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import FormPic from "../../form/FormPic";
import ConfirmationModal from "../Category/ConfirmationModel";

export default function CustomerFormPreview({ details, t, headers }) {
  const token = Cookies.get("token");
  const [images, setImages] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedImage, setSelectedImage] = useState();

  useEffect(() => {
    if (details) {
      setLoading(false);
    }
  }, [details]);
  const handleDelete = useCallback(async () => {
    const imageName = selectedImage.split("/products/").pop();
    // setLoading(true);
    try {
      const response = await axios.delete(
        `https://store-system-api.gleeze.com/api/products/${details._id}/images`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { images: imageName },
        }
      );
      // setImages((prevImages) => prevImages.filter((img) => img !== imageUrl));
      // setLoading(false);
      // const updatedImages = assistantDetails.images.filter(
      //   (img) => img !== imageUrl
      // );
      // setAssistantDetails((prevState) => ({
      //   ...prevState,
      //   images: updatedImages,
      // }));
      console.log("Response:", response.data);
      console.log("Image deleted successfully!", imageName);
      window.location.href = "/products";
    } catch (error) {
      // setLoading(false);
      console.error("Error deleting image:", error);
    }
  }, [token, details, selectedImage]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Limit to maximum 5 files
    setImages((prevFiles) => {
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

  const addImages = async (e) => {
    try {
      if (images) {
        const formData = new FormData();
        images.forEach((file, index) => {
          formData.append("images", file);
        });
        // setLoading(true);
        const response = await axios.put(
          `https://store-system-api.gleeze.com/api/products/${details._id}/images`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Image added successfully:", response.data);
        // setLoading(false);
        // setImages([]);
        window.location.href = "/products";
      }

      // if (response.data.images) {
      //   const uploadedImageURLs = response.data.images.map(
      //     (image) => image.url
      //   );
      // setImageURLs(uploadedImageURLs);
      // }
    } catch (error) {
      console.error("Error adding Image:", error);
    }
  };
  const cancelDelete = useCallback(() => {
    setShowConfirmation(false);
  }, []);
  const handleDeleteImage = (imageUrl) => {
    setShowConfirmation(true);
    setSelectedImage(imageUrl);
  };
  return (
    <dl className="">
      {loading ? (
        <Loading />
      ) : (
        <>
          <ConfirmationModal
            item="Image"
            show={showConfirmation}
            onCancel={cancelDelete}
            onConfirm={() => {
              handleDelete();
              setShowConfirmation(false);
            }}
          />
          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor">
              {headers?.code} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?._id.slice(-4)}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.name} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.name}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.description} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.description}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.category} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.category.name}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.quantity} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.quantity}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.productPrice} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.productPrice}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.sellingPrice} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.sellingPrice}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-3 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.sold} :
            </dt>
            <dd className="mb-3 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.sold}
            </dd>
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

          <div className="d-flex gap-2 items-center">
            <dt className=" font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.images}:
            </dt>
            <dd className="mb-0 font-light text-gray-500 sm:mb-5 dark:text-gray-400 d-flex gap-2 items-center">
              {details.images && details.images.length > 0 ? (
                <div className="d-grid grid-cols-5 m-0 gap-4 ">
                  {details.images.map((imageUrl, index) => (
                    <div key={index} className="d-flex ">
                      <img
                        src={imageUrl}
                        alt="Product"
                        className="max-w-full h-20 rounded-md"
                        crossOrigin="anonymous"
                      />
                      <button
                        className=""
                        onClick={() => handleDeleteImage(imageUrl)}
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
              className=" h-min rounded-md bg-orange-400 font-medium text-xl max-w-60"
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
                        className="max-w-full h-20 rounded-md"
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
