import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useI18nContext } from "../context/i18n-context";

const API_URL = "https://store-system-api.gleeze.com/api/order";
const Orders = () => {
    const token = Cookies.get("token");
    const [orders, setOrders] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            if (token) {
                const ordersResponse = await axios.get(`${API_URL}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(ordersResponse.data.data);
                console.log('object',orders)
            } else {
                console.error("No token found.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
const language=useI18nContext();
    return (
        <div>
            <section className={`bg-gray-700 bg-opacity-25 mx-10 rounded-md pt-2 absolute top-32 -z-3 w-3/4 ${language === "ar" ? "left-10" : "right-10"}`}>
             
                <div className="flex justify-between">
                    {" "}
                    <div className="relative w-96 m-3">
                        {" "}
                   
                    </div>
              
                </div>
                <table className="min-w-full bg-white border-gray-200 shadow-md rounded-md overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                payment Method Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Total Order Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Is Paid
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Is Delivered
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                shipping Price

                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order._id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.paymentMethodType}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.totalOrderPrice}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.isPaid ? "Yes" : "No"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.isDelivered ? "Yes" : "No"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    shippingPrice
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
            </section>
        </div>
    );
};

export default Orders;
