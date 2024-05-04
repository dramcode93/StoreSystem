import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { X } from "@phosphor-icons/react";
import { useI18nContext } from "../../context/i18n-context";
import FormNumber from "../../../form/FormNumber";
import FormSelect from "../../../form/FormSelect";
import { MdDelete } from "react-icons/md";

const API_PRODUCTS_URL =
  "https://store-system-api.gleeze.com/api/products/list";
const API_CUSTOMERS_URL = "https://store-system-api.gleeze.com/api/customers";
const API_BILLS_URL = "https://store-system-api.gleeze.com/api/bills";

const CreateBills = ({ closeModal, modal }) => {
  const token = Cookies.get("token");
  const { t, language } = useI18nContext();
  const [quantity, setQuantity] = useState("");
  const [discount, setDiscount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [billItems, setBillItems] = useState([]);

  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(
      (product) => product._id === selectedProductId
    );
    setSelectedProduct(selectedProduct);
    setProductId(selectedProductId);
  };

  const handleCustomerChange = (e) => {
    const selectedCustomerId = e.target.value;
    const selectedCustomer = customers.find(
      (customer) => customer._id === selectedCustomerId
    );
    setSelectedCustomer(selectedCustomer);
    setCustomerId(selectedCustomerId);
  };
  const addProductToBill = () => {
    if (selectedProduct && quantity && selectedCustomer) {
      // Check if the selected product already exists in the bill items
      const existingItemIndex = billItems.findIndex(
        (item) => item.product._id === selectedProduct._id
      );

      if (existingItemIndex !== -1) {
        // If the product already exists, update its data
        const updatedItems = [...billItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: Number(quantity),
          discount: Number(discount),
          paidAmount: Number(paidAmount),
        };
        setBillItems(updatedItems);
      } else {
        // If the product doesn't exist, add it as a new item
        const newItem = {
          product: selectedProduct,
          quantity: quantity,
          discount: discount,
          paidAmount: paidAmount,
        };
        setBillItems([...billItems, newItem]);
      }
// console.log(billItems)
      // Reset form fields
      setQuantity("");
      setDiscount("");
      setPaidAmount("");
      setSelectedProduct("");
      setSelectedCustomer("");
    }
  };

  const handleDeleteItem = (index) => {
    const updatedBillItems = [...billItems];
    updatedBillItems.splice(index, 1);
    setBillItems(updatedBillItems);
  };

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        setLoading(true);
        const [productsResponse, customersResponse] = await Promise.all([
          axios.get(API_PRODUCTS_URL, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(API_CUSTOMERS_URL, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProducts(productsResponse.data.data);
        setCustomers(customersResponse.data.data);
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

  const createBill = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // if (!customerId || !phoneNumber || !customerAddress) {
      if (!customerId) {
        console.error("Customer information is incomplete");
        return;
      }
      const totalPaidAmount = billItems.reduce(
        (total, item) => total + Number(item.paidAmount),
        0
      );
      const totalDiscount = billItems.reduce(
        (total, item) => total + Number(item.discount),
        0
      );

      const formattedProducts = billItems.map((item) => ({
        product: item.product._id,
        productQuantity: item.quantity,
      }));

      const requestBody = {
        customer: customerId,
        products: formattedProducts,
        paidAmount: totalPaidAmount,
        discount: totalDiscount,
      };
// console.log(requestBody)
      const response = await axios.post(API_BILLS_URL, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomerId("");
      // setPhoneNumber("");
      setPaidAmount("");
      setCustomerAddress("");
      // setSelectedProducts([]);
      window.location.href = "/bills"; // Redirect to bills page after successful submission
    } catch (error) {
      console.error("Error creating bill:", error);
      // Handle the error, display error message or take appropriate action
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <div
        onClick={handleBackgroundClick}
        className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
        absolute top-1/2 -translate-x-1/2 -translate-y-1/2
        z-50 justify-center items-center ${modal ? "left-1/2" : "-left-[100%]"}
         bg-opacity-40 w-full h-full `}
      >
        <div
          className={`CreateCenter w-full max-w-min 
           dark:bg-gray-800 rounded-r-xl duration-200 ease-linear
           ${modal ? "absolute left-0" : "absolute -left-[100%]"}
           h-screen overflow-auto`}
        >
          <div className="relative p-4 dark:bg-gray-800 sm:p-5">
            <div
              dir="rtl"
              className="flex justify-between items-center w-full pb-4  rounded-t border-b sm:mb-5 dark:border-gray-600"
            >
              <h3 className="text-xl font-bold mr-3 text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear">
                Create Bill
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
              onSubmit={createBill}
              className="fs-6 tracking-wider mt-4 p-0 gap-4 grid-cols-2"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <FormNumber
                label="Paid Amount"
                name="paidAmount"
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="Paid Amount"
              />

              <FormSelect
                selectLabel="Select Product"
                headOption="Select a product"
                handleChange={(e) => handleProductChange(e)}
                options={products.map((product) => ({
                  value: product._id,
                  label: product.name,
                }))}
                 name="product"
                value={productId}
              />
              <FormNumber
                label="Quantity"
                name="Quantity"
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
              />
              <FormNumber
                label="Discount"
                name="Discount"
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="Discount"
              />
              <FormSelect
                selectLabel="Select Customer"
                headOption="Select a Customer"
                handleChange={(e) => handleCustomerChange(e)}
                options={customers.map((customer) => ({
                  value: customer._id,
                  label: customer.name,
                }))}
                name="customer"
                value={customerId}
              />
              {selectedProduct && (
                <div className="m-2 w-full flex flex-col">
                  <label className="text-xl fw-bold">
                    Product Price:{" "}
                    <span className="text-gray-400">
                      {selectedProduct.sellingPrice}
                    </span>
                  </label>
                  <label className="text-xl fw-bold">
                    Available Quantity :{" "}
                    <span className="text-gray-400">
                      {selectedProduct.quantity}
                    </span>
                  </label>
                </div>
              )}
              <div className="col-span-2 flex justify-between">
                <button
                  type="reset"
                  onClick={addProductToBill}
                  className="bg-yellow-900 h-12 rounded-md hover:bg-yellow-800 fw-bold text-xl m-2"
                >
                  Add Product +
                </button>
                <button
                  type="submit"
                  className="bg-yellow-900 h-12 rounded-md hover:bg-yellow-800 fw-bold text-xl m-2"
                >
                  Create Bill +
                </button>
              </div>
            </form>
            {billItems.length > 0 && (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-2 ">
                <thead className="text-xm text-gray-200 uppercase">
                  <tr className="text-center bg-gray-500 bg-opacity-25 transition ease-out duration-200">
                    <th scope="col" className="px-4 py-4">
                      Product
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Quantity
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Price
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Total Price
                    </th>
                    <th scope="col" className="px-4 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {billItems.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200"
                    >
                      <td className="px-4 py-4">{item.product?.name}</td>
                      <td className="px-4 py-4">{item.quantity}</td>
                      <td className="px-4 py-4">
                        {item.product?.sellingPrice}
                      </td>
                      <td className="px-4 py-4">
                        {item.quantity * item.product?.sellingPrice}
                      </td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button
                          className="inline-flex items-center text-sm font-medium   p-1.5  text-center text-gray-500 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 bg-transparent"
                          type="button"
                          onClick={() => handleDeleteItem(index)}
                        >
                          <MdDelete
                            size={25}
                            weight="bold"
                            className=" hover:bg-gray-700 w-10 rounded-lg"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200">
                    <th
                      className="px-4 py-4 text-white text-xl text-left"
                      colSpan="3"
                    >
                      Total price
                    </th>
                    <td className="px-4 py-4">
                      {billItems.reduce(
                        (total, item) =>
                          total + item.quantity * item.product?.sellingPrice,
                        0
                      )}
                    </td>
                    <td className="px-4 py-3" />
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBills;