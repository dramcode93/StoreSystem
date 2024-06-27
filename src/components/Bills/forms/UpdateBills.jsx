import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import FormNumber from "../../../form/FormNumber";
import { X } from "@phosphor-icons/react";
import { useI18nContext } from "../../context/i18n-context";
import { MdDelete } from "react-icons/md";
import FormSelect from "../../../form/FormSelect";

const API_URL = "https://store-system-api.gleeze.com/api/products/list";
const API_CUSTOMERS_URL = "https://store-system-api.gleeze.com/api/customers";

const UpdateBills = ({ closeModal, role, modal, billData }) => {
  const token = Cookies.get("token");

  const [products, setProducts] = useState([]);
  const [billProducts, setBillProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customerAddress, setCustomerAddress] = useState("");

  const { language } = useI18nContext();
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [newPaidAmount, setNewPaidAmount] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [customers, setCustomers] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [billItems, setBillItems] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      if (token) {
        setLoading(true);
        const productsResponse = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(productsResponse.data.data);

        const customersResponse = await axios.get(API_CUSTOMERS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(customersResponse.data.data);

        if (billData) {
          const customerId = billData.customer?._id;
          setCustomerId(customerId);
          const formattedBillItems = billData.products?.map((productData) => ({
            product: {
              name: productData.product.name,
              id: productData.product._id,
              sellingPrice: productData.product.sellingPrice,
              totalPrice: productData.totalPrice,
              productQuantity: productData.productQuantity,
            },
            discount: billData.discount,
            paidAmount: billData.paidAmount,
          }));
          setBillItems(formattedBillItems);
          setNewDiscount(billData.discount);
          setNewPaidAmount(billData.paidAmount);
        }
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [token, billData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setSelectedProducts(
      billProducts.map(({ product, productQuantity }) => ({
        productId: product._id,
        quantity: productQuantity,
        price: product.price,
      }))
    );
  }, [billProducts]);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  const handleDeleteItem = (index) => {
    const updatedBillItems = [...billItems];
    updatedBillItems.splice(index, 1);
    setBillItems(updatedBillItems);
  };

  const addProductToBill = () => {
    if (selectedProduct && newQuantity) {
      const existingItemIndex = billItems.findIndex(
        (item) => item.product.id === selectedProduct._id
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...billItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          product: {
            ...updatedItems[existingItemIndex].product,
            productQuantity: newQuantity,
          },
          discount: newDiscount,
          paidAmount: newPaidAmount,
        };
        setBillItems(updatedItems);
      } else {
        const newItem = {
          product: {
            id: selectedProduct._id,
            name: selectedProduct.name,
            sellingPrice: selectedProduct.sellingPrice,
            totalPrice: selectedProduct.totalPrice,
            productQuantity: newQuantity,
          },
          discount: newDiscount,
          paidAmount: newPaidAmount,
        };
        setBillItems([...billItems, newItem]);
      }

      setNewQuantity("");
      setNewDiscount("");
      setNewPaidAmount("");
      setSelectedProduct("");
      setSelectedCustomer("");
    }
  };

  const handleCustomerChange = (e) => {
    const selectedCustomerId = e.target.value;
    const selectedCustomer = customers.find(
      (customer) => customer._id === selectedCustomerId
    );
    setSelectedCustomer(selectedCustomer);
    setCustomerId(selectedCustomerId);
  };
  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(
      (product) => product._id === selectedProductId
    );
    setSelectedProduct(selectedProduct);
    setProductId(selectedProductId);
  };

  const updateBill = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!customerId && !newPaidAmount && !newDiscount) {
        console.error("information is incomplete");
        return;
      }
      // const totalPaidAmount = billItems.reduce(
      //   (total, item) => total + Number(item.paidAmount),
      //   0
      // );

      const formattedProducts = billItems.map((item) => ({
        product: item.product.id,
        productQuantity: item.product.productQuantity,
      }));

      const requestBody = {
        customer: customerId,
        products: formattedProducts,
        paidAmount: newPaidAmount,
      };
      console.log(requestBody)
      console.log(billData._id)
      console.log(token)
      const response = await axios.put(
        `https://store-system-api.gleeze.com/api/bills/${billData?._id}`,
        requestBody,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response)
      setCustomerId("");
      setNewPaidAmount("");
      setCustomerAddress("");
      window.location.href = "/bills";
    } catch (error) {
      console.error("Error updating bill:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      onClick={handleBackgroundClick}
      className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
      fixed top-1/2 -translate-x-1/2 -translate-y-1/2
      z-50 justify-center items-center ${modal ? "-right-1/2" : "-left-[100%]"}
       w-full h-full `}
    >
      <div
        className={`w-full max-w-min 
         sideModal duration-200 ease-linear
         ${
           language === "ar"
             ? "absolute left-0 rounded-r-xl"
             : "absolute right-0 rounded-l-xl"
         }
         h-screen overflow-y-auto overflow-x-hidden`}
      >
        <div className="relative p-4 sideModal sm:p-5">
          <div
            dir="rtl"
            className="flex justify-between items-center w-full pb-4  rounded-t border-b sm:mb-5 dark:border-gray-600"
          >
            <h3 className="text-xl font-bold mr-3 text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear">
              Edit Bill
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
            onSubmit={updateBill}
            className="fs-6 tracking-wider mt-4 p-0 gap-4 grid-cols-2"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <FormNumber
              label="Paid Amount"
              name="paidAmount"
              value={newPaidAmount}
              onChange={(e) => setNewPaidAmount(e.target.value)}
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
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              placeholder="Quantity"
            />
            <FormNumber
              label="Discount"
              name="Discount"
              value={newDiscount}
              onChange={(e) => setNewDiscount(e.target.value)}
              placeholder="Discount"
              max="100"
              min="0"
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
                className="secondaryBtn h-12 rounded-md fw-bold text-xl m-2 "
              >
                Add Product +
              </button>
              <button
                type="submit"
                // disabled={!newPaidAmount||!newDiscount}
                className="secondaryBtn h-12 rounded-md fw-bold text-xl m-2 "
              >
                Edit Bill +
              </button>
            </div>
          </form>
          {billItems?.length > 0 && (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xm text-gray-50 dark:text-gray-200 uppercase">
                <tr className="text-center fs-6 bg-gray-700   tracking-wide  transition ease-out duration-200">
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
                {billItems?.map((item, index) => (
                  <tr
                    key={index}
                    className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-600 hover:bg-opacity-25 transition ease-out duration-200"
                  >
                    <td className="px-4 py-4">{item.product.name}</td>
                    <td className="px-4 py-4">
                      {item.product.productQuantity}
                    </td>
                    <td className="px-4 py-4">{item.product.sellingPrice}</td>
                    <td className="px-4 py-4">
                      {item.product.productQuantity * item.product.sellingPrice}
                    </td>
                    <td className="px-4 py-3 flex items-center justify-end">
                      <button
                        className="inline-flex items-center text-sm font-medium   p-1.5  text-center text-gray-500 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 bg-transparent"
                        type="button"
                        onClick={() => handleDeleteItem(index)}
                      >
                        <MdDelete
                          size={25}
                          color="red"
                          weight="bold"
                          className="  w-10 rounded-lg"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200">
                  <th
                    className="px-4 py-4 secondaryF text-xl text-left"
                    colSpan="3"
                  >
                    Total price
                  </th>
                  <td className="px-4 py-4">
                    {billItems.reduce(
                      (total, item) =>
                        total +
                        item.product.productQuantity *
                          item.product.sellingPrice,
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
  );
};

export default UpdateBills;
