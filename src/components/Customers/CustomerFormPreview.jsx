import { useCallback, useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import axios from "axios";
import Cookies from "js-cookie";
import { useI18nContext } from "../context/i18n-context";

export default function CustomerFormPreview({ details, headers }) {
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);
  const { t, language } = useI18nContext();

  const [specificCustomer, setSpecificCustomer] = useState();

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        
        const product = await axios.get(
          `https://store-system-api.gleeze.com/api/customers/${details._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSpecificCustomer(product.data.data);
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
  console.log("details",details)
console.log("specificCustomer",specificCustomer)
  return (
    <dl className="">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor">
              {headers?.code} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {specificCustomer?._id.slice(-4)}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.name} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {specificCustomer?.name}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.address} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {specificCustomer?.address.map((address) => (
                <div key={address.id}>
                  {`${address.street},
                        ${
                          language === "ar"
                            ? address.city.city_name_ar
                            : address.city.city_name_en
                        },
                        ${
                          language === "ar"
                            ? address.governorate.governorate_name_ar
                            : address.governorate.governorate_name_en
                        }`}
                </div>
              ))}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.phone} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {specificCustomer?.phone.map((phone, index) => (
                <div key={index}>{phone}</div>
              ))}
            </dd>
          </div>
          <div className="">
            <dt className="mb-1 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.bills} :
            </dt>
            <dt className="d-flex flex-col text-gray-900 dark:text-gray-300 m-0">
              {specificCustomer && specificCustomer.bills && specificCustomer.bills.length > 0 ? (
                specificCustomer.bills.map((bill, index) => (
                  <dt
                    className="d-flex gap-1 items-center justify-between flex-wrap border-b-2 mb-2"
                    key={index}
                  >
                    <div>
                      <dd className="!text-base font-medium">Bill Code: </dd>
                      <dd className="!text-base font-light text-gray-500 sm:mb-3 dark:text-gray-400">
                        {bill._id.slice(-6)}
                      </dd>
                    </div>
                    <div>
                      <dd className="!text-base font-medium">Created At:</dd>
                      <dd className="!text-base font-light text-gray-500 sm:mb-3 dark:text-gray-400">
                        {new Date(bill.createdAt).toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dd className="!text-base font-medium">Updated At:</dd>
                      <dd className="!text-base font-light text-gray-500 sm:mb-3 dark:text-gray-400 ">
                        {new Date(bill.updatedAt).toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dd className="!text-base font-medium ">Products:</dd>
                      <dd className="!text-base font-light text-gray-500 sm:mb-3 dark:text-gray-400">
                        {bill.products.map((product, index) => (
                          <span key={index} className="d-flex flex-col">
                          {product.product?.name || "Product not found"}
                            {index !== bill.products?.length - 1 && ", "}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dt>
                ))
              ) : (
                <dd>No bills Yet</dd>
              )}
            </dt>
          </div>
        </>
      )}
    </dl>
  );
}
