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
            className={`text-lg md:text-xl mx-auto text-center
              secondaryBtn p-1 mb-4 rounded-md `}
          >
            <h3 className="font-semibold">{t("previewForm.title")}</h3>
          </div>

          <dl>
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className="d-flex gap-2">
                  <h4 className="font-semibold secondaryF">order Code:</h4>
                  <div className="d-flex gap-1">
                    <dd className="!text-base font-light text-gray-500 sm:mb-1">
                      <h4 className="font-semibold text-xl">
                        {assistantData._id.slice(-4)}
                      </h4>
                    </dd>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <h4 className="font-semibold secondaryF">Shop:</h4>
                  <div className="d-flex gap-1">
                    <dd className="!text-base font-light text-gray-500 sm:mb-1">
                      <h4 className="font-semibold text-xl">
                        {assistantData.shop.name}
                      </h4>
                    </dd>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <h4 className="font-semibold secondaryF">Branch name:</h4>
                  <div className="d-flex gap-1">
                    <dd className="!text-base font-light text-gray-500 sm:mb-1">
                      <h4 className="font-semibold text-xl">
                        {assistantData.subShop.name}
                      </h4>
                    </dd>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <h4 className="font-semibold secondaryF">Customer name:</h4>
                  <div className="d-flex gap-1">
                    <dd className="!text-base font-light text-gray-500 sm:mb-1">
                      <h4 className="font-semibold text-xl">
                        {assistantData.user.name}
                      </h4>
                    </dd>
                  </div>
                </div>

                <h4 className="font-semibold secondaryF">Customer phone:</h4>
                {assistantData?.user?.phone.length > 0 ? (
                  assistantData.user.phone.map((phone) => (
                    <div className="d-flex gap-1" key={phone}>
                      <dd className="!text-base font-light text-gray-500 sm:mb-1">
                        <h4 className="font-semibold text-xl ">{phone}</h4>
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
                <h4 className="font-semibold secondaryF">Customer address:</h4>
                {assistantData?.user?.address.length > 0 ? (
                  assistantData.user.address.map((address) => (
                    <div className="d-flex gap-1" key={address?._id}>
                      <dd className="!text-base font-light text-gray-500 sm:mb-1">
                        <h4 className="font-semibold text-xl ">
                          {`${address?.street}, ${
                            language === "ar"
                              ? address?.city?.city_name_ar
                              : address?.city?.city_name_en
                          }, ${
                            language === "ar"
                              ? address?.governorate?.governorate_name_ar
                              : address?.governorate?.governorate_name_en
                          }`}
                        </h4>
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
                <h4 className="font-semibold secondaryF">
                  {t("previewForm.products")} :{" "}
                </h4>
                {assistantData?.cartItems?.length > 0 ? (
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
                )}
              </>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
