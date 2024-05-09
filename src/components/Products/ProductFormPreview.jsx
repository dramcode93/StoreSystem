import { useCallback, useState } from "react";
import Loading from "../Loading/Loading";
import { FaTrash } from 'react-icons/fa';
import axios from "axios";
import Cookies from "js-cookie";

export default function ProductFormPreview({ details, t, headers, loading }) {
  const token = Cookies.get("token");

  const [selectedProductId, setSelectedProductId] = useState(null);
  
  const confirmDelete = useCallback(() => {
    axios
      .delete(`https://store-system-api.gleeze.com/api/products/6629c6c6221adcb4346aac06/images`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => console.error("Error deleting image:", error))
      .finally(() => {

      });
  }, [ token, ]);


  return (
    <dl className="">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="d-flex gap-2 items-center">
            <dt className="mb-3 font-semibold leading-none text-gray-900 dark:text-themeColor">
              {headers?.code} :
            </dt>
            <dd className="mb-3 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?._id.slice(-4)}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-3 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.name} :
            </dt>
            <dd className="mb-3 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.name}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-3 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.description} :
            </dt>
            <dd className="mb-3 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.description}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-3 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.category} :
            </dt>
            <dd className="mb-3 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.category.name}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-3 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.quantity} :
            </dt>
            <dd className="mb-3 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.quantity}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-3 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.productPrice} :
            </dt>
            <dd className="mb-3 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.productPrice}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-3 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.sellingPrice} :
            </dt>
            <dd className="mb-3 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
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
            <dd className=" font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details.images && details.images.length > 0 ? (
                <div className="d-grid grid-cols-2 m-0 gap-2 ">
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
                        // onClick={() => handleDelete(index)}
                      >
                        <FaTrash size={18} color="red" />
                      </button>
                    </div>
                  ))}
                  <button className="w-24 h-min rounded-md bg-orange-400 mt-4 " 
                  
                  // onClick={handleAdd}
                  >
                    + Add
                  </button>
                </div>
              ) : (
                <div className="d-flex ">No Images Yet</div>
              )}
            </dd>
          </div>
        </>
      )}
    </dl>
  );
}
