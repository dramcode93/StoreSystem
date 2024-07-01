import { X } from "@phosphor-icons/react";
import { useI18nContext } from "../../context/i18n-context";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Loading from "../../Loading/Loading";

export default function OrderPreview({ closeModal, assistantData }) {
  console.log(assistantData);
  const [specificProducts, setSpecificProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useI18nContext();

  const detailsData = {
    code: assistantData._id.slice(-4),
    name: assistantData.name || "لم يتم تحديده",
    products: specificProducts,
  };
  const headers = {
    code: "order Code",
    name: "order Name",
    products: "Products",
  };

  const token = Cookies.get("token");

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const response = await axios.get(
          `https://store-system-api.gleeze.com/api/order/${assistantData._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSpecificProducts(response.data.data);
        console.log("specific", response.data.data);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error fetching specific data:", error);
    } finally {
      setLoading(false);
    }
  }, [token, assistantData._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
    fixed top-1/2 -translate-x-1/2 -translate-y-1/2
    z-50 justify-center items-center left-1/2
      w-full h-full `}
    >
      <div
        className={`PreviewUser max-w-2xl 
        rounded-2xl duration-200 ease-linear
       absolute top-2/3 sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-full
       min-h-screen overflow-auto sideModal `}
      >
        <div className="relative sideModal sm:p-5">
          <div
            dir="rtl"
            className="flex justify-between items-center w-full mb-3 rounded"
          >
            <button
              type="button"
              onClick={closeModal}
              className="w-fit text-gray-400 bg-transparent hover:bg-gray-200 
                                hover:text-gray-900 rounded-lg text-sm p-1.5 mr-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <X size={18} weight="bold" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div
            className={`  mx-auto text-center
              myColor p-1 mb-4`}
          >
            <h3 className="font-semibold mb-0 py-1 text-white">{t("previewForm.title")}</h3>
          </div>

          <dl>
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className="d-flex gap-2">
                  <h5 className=" secondaryF">Order Code:</h5>
                  <div className="d-flex gap-1">
                    <dd className=" font-light text-gray-500 sm:mb-2">
                      <h5 className=" ">{assistantData._id.slice(-4)}</h5>
                    </dd>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <h5 className=" secondaryF">Shop:</h5>
                  <div className="d-flex gap-1">
                    <dd className="!text-base font-light text-gray-500 sm:mb-2">
                      <h5 className=" text-xl">{assistantData.shop.name}</h5>
                    </dd>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <h5 className=" secondaryF">Branch name:</h5>
                  <div className="d-flex gap-1">
                    <dd className="!text-base font-light text-gray-500 sm:mb-2">
                      <h5 className=" text-xl">{assistantData.subShop.name}</h5>
                    </dd>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <h5 className=" secondaryF">Customer name:</h5>
                  <div className="d-flex gap-1">
                    <dd className="!text-base font-light text-gray-500 sm:mb-2">
                      <h5 className=" text-xl">{assistantData.user.name}</h5>
                    </dd>
                  </div>
                </div>

                <h5 className=" secondaryF">Customer phone:</h5>
                {assistantData?.user?.phone.length > 0 ? (
                  assistantData.user.phone.map((phone) => (
                    <div className="d-flex gap-1" key={phone}>
                      <dd className="!text-base font-light text-gray-500 sm:mb-2">
                        <h5 className=" text-xl ">{phone}</h5>
                      </dd>
                    </div>
                  ))
                ) : (
                  <div className="d-flex gap-1">
                    <dd className="!text-base font-light  sm:mb-5 secondaryF">
                      No Addresses yet
                    </dd>
                  </div>
                )}
                <h5 className=" secondaryF">Customer address:</h5>
                {assistantData?.user?.address.length > 0 ? (
                  assistantData.user.address.map((address) => (
                    <div className="d-flex gap-1" key={address?._id}>
                      <dd className="!text-base font-light text-gray-500 sm:mb-2">
                        <h5 className=" text-xl ">
                          {`${address?.street}, ${
                            language === "ar"
                              ? address?.city?.city_name_ar
                              : address?.city?.city_name_en
                          }, ${
                            language === "ar"
                              ? address?.governorate?.governorate_name_ar
                              : address?.governorate?.governorate_name_en
                          }`}
                        </h5>
                      </dd>
                    </div>
                  ))
                ) : (
                  <div className="d-flex gap-1">
                    <dd className="!text-base font-light  sm:mb-5 secondaryF">
                      No Addresses yet
                    </dd>
                  </div>
                )}
                <h5 className="font-semibold secondaryF sm:mb-5 ">
                  {t("previewForm.products")} :{" "}
                </h5>

                {assistantData?.cartItems?.length > 0 ? (
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xm text-gray-50 dark:text-gray-200 uppercase">
                      <tr className="text-center fs-6 bg-gray-700   tracking-wide  transition ease-out duration-200">
                        <th scope="col" className="px-4 py-3">
                          Product
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Quantity
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Price
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Total Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {assistantData.cartItems.map((item, index) => (
                        <tr
                          key={index}
                          className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-600 hover:bg-opacity-25 transition ease-out duration-200"
                        >
                          <td className="px-4 py-3">{item.product?.name}</td>
                          <td className="px-4 py-3">{item.productQuantity}</td>
                          <td className="px-4 py-3">
                            {item.product?.sellingPrice} $
                          </td>
                          <td className="px-4 py-3">{item.totalPrice} $</td>
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
                {/* {assistantData?.cartItems?.length > 0 ? (
                  assistantData.cartItems.map((item) => (
                    <div className="d-flex gap-1" key={item.product?._id}>
                      <dd className="!text-base font-light text-gray-500 sm:mb-1">
                        <h4 className="font-semibold text-xl">
                          {" "}
                          {item.product?.name} - {item.product?.sellingPrice}$
                        </h4>
                      </dd>
                    </div>
                  ))
                ) : (
                  <div className="d-flex gap-1">
                    <dd className="!text-base font-light  sm:mb-5 secondaryF">
                      No products yet
                    </dd>
                  </div>
                )} */}
              </>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
