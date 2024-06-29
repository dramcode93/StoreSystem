import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useI18nContext } from "../context/i18n-context";
import Loading from "../Loading/Loading";
import { DotsThree, Eye } from "@phosphor-icons/react";
import { CiSearch } from "react-icons/ci";
import { MdPersonAddDisabled } from "react-icons/md";
import { VscActivateBreakpoints } from "react-icons/vsc";

const API_URL = "https://store-system-api.gleeze.com/api/order";

const OrdersTable = ({ role, openPreview }) => {
  const token = Cookies.get("token");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useI18nContext();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const dropdownRefs = useRef({});
  // const [role, setRole] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (token) {
  //       try {
  //         const response = await axios.get(
  //           "https://store-system-api.gleeze.com/api/Users/getMe",
  //           { headers: { Authorization: `Bearer ${token}` } }
  //         );
  //         setRole(response.data.data.role || "shop");
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //         if (
  //           error.response &&
  //           error.response.data.message === "jwt malformed"
  //         ) {
  //           Cookies.remove("token");
  //         }
  //         setRole("shop");
  //       }
  //     }
  //   };
  //   fetchUserData();
  // }, [token]);

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const response = await axios.get(`${API_URL}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.data);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleEditDropdown = (orderId) => {
    setSelectedOrderId((prevOrderId) =>
      prevOrderId === orderId ? null : orderId
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const handleUpdatePay = async (id, newActiveStatus) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}/pay`,
        { active: newActiveStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      fetchData();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleUpdateDelivery = async (id, newActiveStatus) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}/deliver`,
        { active: newActiveStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchData();
      console.log(response);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order._id.includes(searchTerm)
  );

  const handleOrderPreview = (order) => {
    openPreview(order);
  };

  return (
    <section
      className={`secondary mx-10 pt-2 absolute top-32 -z-50 w-3/4 ${
        language === "ar" ? "left-10" : "right-10"
      }`}
    >
      <div className="flex justify-between">
        <div className="relative w-96 m-3">
          <input
            className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:bg-gray-500"
            type="text"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            placeholder={t("Products.Search")}
          />
          <CiSearch
            className={`absolute top-2 text-gray-900 dark:text-gray-50 text-xl ${
              language === "ar" ? "left-3" : "right-3"
            } cursor-pointer`}
            onClick={handleSearch}
          />
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xm text-gray-50 dark:text-gray-200 uppercase">
          <tr className="text-center fs-6 bg-gray-700   tracking-wide  transition ease-out duration-200">
            <th scope="col" className="px-4 py-4">
              Order ID
            </th>
            <th scope="col" className="px-4 py-4">
              Total Order Price
            </th>
            <th scope="col" className="px-4 py-4">
              Paid
            </th>
            <th scope="col" className="px-4 py-4">
              Paid At
            </th>
            <th scope="col" className="px-4 py-4">
              Delivered
            </th>
            <th scope="col" className="px-4 py-4">
              Delivered At
            </th>
            <th scope="col" className="px-4 py-4">
              Payment Method
            </th>
            <th scope="col" className="px-4 py-4">
              Receiving Method
            </th>
            <th scope="col" className="px-2 py-4">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" className="fs-4 text-center mb-5 pb-3">
                <Loading />
              </td>
            </tr>
          ) : (
            <>
              {filteredOrders.length === 0 ? (
                <tr className="text-xl text-center my-5 p-3">
                  <td colSpan="9" style={{ lineHeight: 3 }}>
                    No orders available
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-600 hover:bg-opacity-25 transition ease-out duration-200">
                      <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-[5rem] truncate">
                        {order._id.slice(-4)}
                      </td>
                      <td className="px-4 py-4">{order.totalOrderPrice}</td>
                      <td className="px-4 py-4">
                        {order.isPaid ? "Yes" : "No"}
                      </td>
                      <td className="px-2 py-4 ">
                        {order.isPaid ? formatDate(order.paidAt) : "-"}
                      </td>
                      <td className="px-4 py-4">
                        {order.isDelivered ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-4">
                        {order.isDelivered
                          ? formatDate(order.deliveredAt)
                          : "-"}
                      </td>
                      <td className="px-4 py-4">{order.paymentMethodType}</td>
                      <td className="px-4 py-4">{order.receivingMethod}</td>
                      <td className="px-3 py-3 flex items-center justify-end">
                        <button
                          className="inline-flex items-center text-sm font-medium p-1.5 text-center text-gray-500 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 bg-transparent"
                          type="button"
                          onClick={() => toggleEditDropdown(order._id)}
                          ref={(el) => (dropdownRefs.current[order._id] = el)}
                        >
                          <DotsThree
                            size={25}
                            weight="bold"
                            className="hover:bg-slate-300  dark:hover:bg-gray-600 w-10 rounded-lg"
                          />
                        </button>
                        <div
                          className="absolute z-10"
                          dir={language === "ar" ? "rtl" : "ltr"}
                        >
                          <div
                            id={`order-dropdown-${order._id}`}
                            className={`${
                              selectedOrderId === order._id
                                ? `absolute -top-3 ${
                                    language === "en"
                                      ? "right-full"
                                      : "left-full"
                                  } overflow-auto`
                                : "hidden"
                            } z-10 w-56  rounded divide-y divide-gray-100 shadow secondary `}
                          >
                            <ul className="text-sm bg-transparent pl-0 mb-0 w-full">
                              <li>
                                <button
                                  type="button"
                                  className="flex w-56 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 dots hover:bg-slate-300 dark:hover:bg-gray-600 dark:text-white text-gray-700 "
                                  onClick={() => handleOrderPreview(order)}
                                >
                                  <Eye size={18} weight="bold" />
                                  {t("Category.Preview")}
                                </button>
                              </li>
                              {role !== "customer" && (
                                <>
                                  <li>
                                    <button
                                      type="button"
                                      className="flex w-56 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 dots hover:bg-slate-300 dark:hover:bg-gray-600 dark:text-white text-gray-700 "
                                      onClick={() =>
                                        handleUpdatePay(
                                          order._id,
                                          !order.isPaid
                                        )
                                      }
                                    >
                                      {order.isPaid ? (
                                        <>
                                          <MdPersonAddDisabled
                                            size={18}
                                            weight="bold"
                                          />
                                          {t("order.DisablePaid")}
                                        </>
                                      ) : (
                                        <>
                                          <VscActivateBreakpoints
                                            size={18}
                                            weight="bold"
                                            className="text-green-600"
                                          />
                                          {t("order.EnablePaid")}
                                        </>
                                      )}
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      type="button"
                                      className="flex w-56 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 dots hover:bg-slate-300 dark:hover:bg-gray-600 dark:text-white text-gray-700 "
                                      onClick={() =>
                                        handleUpdateDelivery(
                                          order._id,
                                          !order.isDelivered
                                        )
                                      }
                                    >
                                      {order.isDelivered ? (
                                        <>
                                          <MdPersonAddDisabled
                                            size={18}
                                            weight="bold"
                                          />
                                          {t("order.DisableDelivered")}
                                        </>
                                      ) : (
                                        <>
                                          <VscActivateBreakpoints
                                            size={18}
                                            weight="bold"
                                            className="text-green-600"
                                          />
                                          {t("order.EnableDelivered")}
                                        </>
                                      )}
                                    </button>
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              )}
            </>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default OrdersTable;
