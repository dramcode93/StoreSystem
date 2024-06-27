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
  console.log("details", details);
  console.log("specificCustomer", specificCustomer);
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
  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-gray-50 dark:text-gray-200">
      <tr className="text-center fs-8 text-sm bg-gray-700 tracking-wide transition ease-out duration-200">
        <th scope="col" className="px-1 py-1">
          Bill Code
        </th>
        <th scope="col" className="px-1 py-1">
          Created At
        </th>
        <th scope="col" className="px-1 py-1">
          Total Amount
        </th>
        <th scope="col" className="px-1 py-1">
          Paid Amount
        </th>
        <th scope="col" className="px-1 py-1">
          Remaining Amount
        </th>
        <th scope="col" className="px-1 py-1">
          Products
        </th>
      </tr>
    </thead>
    <tbody>
      {specificCustomer &&
      specificCustomer.bills &&
      specificCustomer.bills.length > 0 ? (
        specificCustomer.bills.map((bill, index) => (
          <tr
            key={index}
            className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-600 hover:bg-opacity-25 transition ease-out duration-200"
          >
            <td className="px-1 py-1 font-small text-gray-900 whitespace-nowrap dark:text-white max-w-[5rem] truncate">
              {bill._id.slice(-6)}
            </td>
            <td className="px-1 py-1 min-w-32">
              {new Date(bill.createdAt).toLocaleDateString()} <br />
              {new Date(bill.createdAt).toLocaleTimeString()}
            </td>
            <td className="px-1 py-1">{bill.totalAmountAfterDiscount}</td>
            <td className="px-1 py-1">{bill.paidAmount}</td>
            <td className="px-1 py-1">{bill.remainingAmount}</td>
            <td className="px-1 py-1">
              {bill.products.map((product, index) => (
                <div key={index} className="d-flex flex-col min-w-32">
                  {product.product?.name || "Product not found"}
                </div>
              ))}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="text-center py-4">
            No bills Yet
          </td>
        </tr>
      )}
    </tbody>
  </table>
</dt>


          </div>
        </>
      )}
    </dl>
  );
}


        // <dt className="d-flex flex-col text-gray-900 dark:text-gray-300 m-0">
        //       {specificCustomer &&
        //       specificCustomer.bills &&
        //       specificCustomer.bills.length > 0 ? (
        //         specificCustomer.bills.map((bill, index) => (
        //           <dt
        //             className="d-flex gap-1 items-center justify-between flex-wrap border-b-2 mb-2"
        //             key={index}
        //           >
                    {/* <div>
                      <dd className="!text-base font-medium">Bill Code: </dd>
                      <dd className="!text-base font-light text-gray-500 sm:mb-3 dark:text-gray-400">
                        {bill._id.slice(-6)}
                      </dd>
                    </div>
                    <div>
                      <dd className="!text-base font-medium">Created At:</dd>
                      <dd className="!text-base font-light text-gray-500 sm:mb-3 dark:text-gray-400">
                        {new Date(bill.createdAt).toLocaleDateString()} <br />
                        {new Date(bill.createdAt).toLocaleTimeString()}
                      </dd>
                    </div>
                    <div>
                      <dd className="!text-base font-medium">
                        Total Amount After Discount
                      </dd>
                      <dd className="!text-base font-light text-gray-500 sm:mb-3 dark:text-gray-400 ">
                        {bill.totalAmountAfterDiscount}
                      </dd>
                    </div>
                    <div>
                      <dd className="!text-base font-medium">Paid Amount</dd>
                      <dd className="!text-base font-light text-gray-500 sm:mb-3 dark:text-gray-400 ">
                        {bill.paidAmount}
                      </dd>
                    </div>
                    <div>
                      <dd className="!text-base font-medium">
                        Remaining Amount
                      </dd>
                      <dd className="!text-base font-light text-gray-500 sm:mb-3 dark:text-gray-400 ">
                        {bill.remainingAmount}
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
                    </div> */}

                    // <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    //   <thead className=" text-gray-50 dark:text-gray-200 ">
                    //     <tr className="text-center fs-8 text-sm  bg-gray-700   tracking-wide  transition ease-out duration-200">
                    //       <th scope="col" className="px-1 py-1">
                    //         Bill Code
                    //       </th>
                    //       <th scope="col" className="px-1 py-1">
                    //         Created At
                    //       </th>
                    //       <th scope="col" className="px-1 py-1">
                    //         Total Amount
                    //       </th>
                    //       <th scope="col" className="px-1 py-1">
                    //         Paid Amount
                    //       </th>
                    //       <th scope="col" className="px-1 py-1">
                    //         Remaining Amount
                    //       </th>
                    //       <th scope="col" className="px-1 py-1">
                    //         Products
                    //       </th>
                    //     </tr>
                    //   </thead>
                    //   <tbody>
                    //     {loading ? (
                    //       <tr>
                    //         <td
                    //           colSpan="5"
                    //           className=" fs-4 text-center mb-5 pb-3"
                    //         >
                    //           <Loading />
                    //         </td>
                    //       </tr>
                    //     ) : (
                    //       <>
                    //         <tr className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-600 hover:bg-opacity-25 transition ease-out duration-200">
                    //           <th
                    //             scope="row"
                    //             className="px-1 py-1 font-small text-gray-900 whitespace-nowrap dark:text-white max-w-[5rem] truncate"
                    //           >
                    //             {bill._id.slice(-6)}
                    //           </th>
                    //           <td className="px-1 py-1 min-w-32 ">
                    //             {new Date(bill.createdAt).toLocaleDateString()}{" "}
                    //             <br />
                    //             {new Date(bill.createdAt).toLocaleTimeString()}
                    //           </td>
                    //           <td className="px-1 py-1">
                    //             {bill.totalAmountAfterDiscount}
                    //           </td>
                    //           <td className="px-1 py-1">{bill.paidAmount}</td>
                    //           <td className="px-1 py-1">
                    //             {bill.remainingAmount}
                    //           </td>
                    //           <td className="px-1 py-1">
                    //             {bill.products.map((product, index) => (
                    //               <div key={index} className="d-flex flex-col min-w-32">
                    //                 {product.product?.name ||
                    //                   "Product not found "}
                    //               </div>
                    //             ))}
                    //           </td>
                    //         </tr>
                    //       </>
                    //     )}
                    //   </tbody>
                    // </table>
            //       </dt>
            //     ))
            //   ) : (
            //     <dd>No bills Yet</dd>
            //   )}
            // </dt>