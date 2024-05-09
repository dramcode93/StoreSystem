import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "../styles.module.css";
import { Translate } from "translate-easy";
import LogOut from "../../LogOut/LogOut";
import { useParams } from "react-router-dom";
import Loading from "../../Loading/Loading";
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
  // const { id } = useParams();

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [products, setProducts] = useState([]);
  const [billProducts, setBillProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customerAddress, setCustomerAddress] = useState("");

  const { t, language } = useI18nContext();
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
        // const billResponse = await axios.get(
        //   `https://store-system-api.gleeze.com/api/bills/${billData?._id}`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        const customersResponse = await axios.get(API_CUSTOMERS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(customersResponse.data.data);
        // setCustomerName(billResponse.data?.data?.customerName);
        // setPhoneNumber(billResponse.data?.data?.phone);
        // setBillProducts(billResponse.data?.data?.products);
        // setPaidAmount(billResponse.data?.data?.paidAmount || 0);
        // setCustomerAddress(billResponse.data?.data?.customerAddress || "");

        if (billData) {
          // Extract bill items from billData and format them
          const customerId = billData.customer?._id;
          setCustomerId(customerId);
          const formattedBillItems = billData.products?.map((productData) => ({
            product: {
              name: productData.product.name,
              id: productData.product._id,
              sellingPrice: productData.product.sellingPrice,
              totalPrice: productData.totalPrice,
              productQuantity: productData.productQuantity,
              // Add any other properties you need from the product
            },
            discount: billData.discount,
            paidAmount: billData.paidAmount,
          }));
          setBillItems(formattedBillItems);
          setNewDiscount(billData.discount);
          setNewPaidAmount(billData.paidAmount);
          // setNewQuantity(billData.product?.productQuantity)
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

  // const handleProductChange = (index, productId) => {
  //   const newSelectedProducts = [...selectedProducts];
  //   const selectedProduct = products.find(
  //     (product) => product._id === productId
  //   );

  //   newSelectedProducts[index] = {
  //     productId,
  //     price: selectedProduct.price||0,
  //     quantity: selectedProduct.quantity||0,
  //   };

  //   setSelectedProducts(newSelectedProducts);
  // };

  const handleQuantityChange = (index, quantity) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].quantity = quantity;
    setSelectedProducts(newSelectedProducts);
  };

  const addProductFields = () => {
    setSelectedProducts([
      ...selectedProducts,
      { productId: "", quantity: "", price: 0 },
    ]);
  };

  const deleteProductFromBill = (index) => {
    const newBillProducts = [...billProducts];
    newBillProducts.splice(index, 1);
    setBillProducts(newBillProducts);
  };

  // const updateBill = async () => {
  //   try {
  //     setLoading(true);

  //     const productQuantityMap = {};
  //     const productsArray = selectedProducts.map(
  //       ({ productId, quantity, price }) => {
  //         productQuantityMap[productId] = quantity;
  //         return { product: productId, quantity, price };
  //       }
  //     );

  //     const requestBody = {
  //       customerName,
  //       phone: phoneNumber,
  //       products: productsArray,
  //       productQuantityMap,
  //       paidAmount: Number(paidAmount),
  //       customerAddress,
  //     };

  //     const response = await axios.put(
  //       `https://store-system-api.gleeze.com/api/bills/${billData?._id}`,
  //       requestBody,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     setCustomerName("");
  //     setPhoneNumber("");
  //     setPaidAmount(0);
  //     setCustomerAddress("");
  //     setSelectedProducts([{ productId: "", quantity: "", price: 0 }]);
  //     window.location.href = "/bills";
  //   } catch (error) {
  //     console.error("Error updating bill:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const cancelBill = () => {
    window.location.href = "/bills";
  };

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
      // Check if the selected product already exists in the bill items
      const existingItemIndex = billItems.findIndex(
        (item) => item.product.id === selectedProduct._id
      );

      if (existingItemIndex !== -1) {
        // If the product already exists, update its data
        const updatedItems = [...billItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          product: {
            ...updatedItems[existingItemIndex].product,
            productQuantity: newQuantity,
            // Update any other properties you need from the product
          },
          discount: newDiscount,
          paidAmount: newPaidAmount,
        };
        setBillItems(updatedItems);
      } else {
        // If the product doesn't exist, add it as a new item
        const newItem = {
          product: {
            id: selectedProduct._id,
            name: selectedProduct.name,
            sellingPrice: selectedProduct.sellingPrice,
            totalPrice: selectedProduct.totalPrice, // Handle undefined totalPrice
            productQuantity: newQuantity,
            // Add any other properties you need from the product
          },
          discount: newDiscount,
          paidAmount: newPaidAmount,
        };
        setBillItems([...billItems, newItem]);
      }

      // Reset form fields
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
      // if (!customerId || !phoneNumber || !customerAddress) {
      if (!customerId && !newPaidAmount && !newDiscount) {
        console.error("information is incomplete");
        return;
      }
      const totalPaidAmount = billItems.reduce(
        (total, item) => total + Number(item.paidAmount),
        0
      );
      // const totalDiscount = billItems.reduce((total, item) => total + Number(item.discount), 0);

      const formattedProducts = billItems.map((item) => ({
        product: item.product.id,
        productQuantity: item.product.productQuantity,
      }));

      const requestBody = {
        customer: customerId,
        products: formattedProducts,
        paidAmount: totalPaidAmount,
        // discount: totalDiscount,
      };
      const response = await axios.put(
        `https://store-system-api.gleeze.com/api/bills/${billData?._id}`,
        requestBody,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCustomerId("");
      // setPhoneNumber("");
      setNewPaidAmount("");
      setCustomerAddress("");
      // setSelectedProducts([]);
      window.location.href = "/bills"; // Redirect to bills page after successful submission
    } catch (error) {
      console.error("Error updating bill:", error);
      // Handle the error, display error message or take appropriate action
    } finally {
      setLoading(false);
    }
  };
  return (
    // <div className={styles.createBill}>
    //   <LogOut />
    //   <MainComponent />
    //   <form>
    //     {loading && <div className='m-5 fs-3 text-center'><Loading /></div>}
    //     <div>
    //       <label htmlFor="customerName">
    //         <Translate>Client Name : </Translate>
    //       </label>
    //       <input
    //         id="customerName"
    //         type="text"
    //         placeholder="Client Name"
    //         name="customerName"
    //         value={customerName}
    //         onChange={(e) => setCustomerName(e.target.value)}
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="phoneNumber">
    //         <Translate>Phone Number : </Translate>
    //       </label>
    //       <input
    //         id="phoneNumber"
    //         placeholder="Phone Number"
    //         type="text"
    //         name="phone"
    //         value={phoneNumber}
    //         onChange={(e) => setPhoneNumber(e.target.value)}
    //       />
    //     </div>

    //     <div>
    //       <label htmlFor="customerAddress">
    //         <Translate>Customer Address : </Translate>
    //       </label>
    //       <input
    //         id="customerAddress"
    //         placeholder="Customer Address"
    //         type="text"
    //         name="customerAddress"
    //         value={customerAddress}
    //         onChange={(e) => setCustomerAddress(e.target.value)}
    //       />
    //     </div>
    //     {selectedProducts.map((selectedProduct, index) => (
    //       <div key={index}>
    //         <select
    //           name="product"
    //           className={styles.inputField}
    //           onChange={(e) => handleProductChange(index, e.target.value)}
    //           value={selectedProduct.productId}
    //         >
    //           <option disabled value="">
    //             <Translate>Select Product : </Translate>
    //           </option>
    //           {products.map((product) => (
    //             <option key={product._id} value={product._id}>
    //               {product.name}
    //             </option>
    //           ))}
    //         </select>
    //         <div>
    //           <label htmlFor={`productQuantity${index}`}>
    //             <Translate>Product Quantity : </Translate>
    //           </label>
    //           <input
    //             id={`productQuantity${index}`}
    //             type="number"
    //             name={`productQuantity${index}`}
    //             value={selectedProduct.quantity}
    //             placeholder="Product Quantity"
    //             onChange={(e) => handleQuantityChange(index, e.target.value)}
    //           />
    //         </div>
    //         {selectedProduct.productId ? (
    //           <div className="fw-bold pt-3">
    //             <span className="p-5">
    //               <Translate>Price : </Translate> {selectedProduct.price}
    //             </span>
    //             <span>
    //               <Translate>Quantity : </Translate> {selectedProduct.quantity}
    //             </span>
    //           </div>
    //         ) : null}
    //         <button type="button" onClick={addProductFields} className={styles.addBtn}>
    //           <Translate>Add Product</Translate>
    //         </button>
    //         <button type="button" className={styles.deleteButton} onClick={() => deleteProductFromBill(index)}>
    //           <Translate>X</Translate>
    //         </button>
    //       </div>
    //     ))}

    //     <div>
    //       <label htmlFor="paidAmount">
    //         <Translate>Paid Amount : </Translate>
    //       </label>
    //       <input
    //         placeholder="Paid Amount"
    //         id="paidAmount"
    //         type="number"
    //         name="paidAmount"
    //         value={paidAmount}
    //         onChange={(e) => setPaidAmount(e.target.value)}
    //       />
    //     </div>
    //     <div className='flex my-2'>
    //       <button type="button" onClick={updateBill} className={styles.addBtn}>
    //         <Translate>Update Bill</Translate>
    //       </button>
    //       <button type="button" onClick={cancelBill} className='bg-danger w-25 rounded-2'>
    //         <Translate>Cancel</Translate>
    //       </button>
    //     </div>
    //   </form>
    // </div>

    <div
      onClick={handleBackgroundClick}
      className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
      fixed top-1/2 -translate-x-1/2 -translate-y-1/2
      z-50 justify-center items-center ${modal ? "left-1/2" : "-left-[100%]"}
       bg-opacity-40 w-full h-full `}
    >
      <div
        className={`CreateCenter w-full max-w-min 
       dark:bg-gray-800 rounded-r-xl duration-200 ease-linear
       ${modal ? "absolute left-0" : "absolute -left-[100%]"}
       h-screen overflow-auto `}
      >
        <div className="relative p-4 dark:bg-gray-800 sm:p-5">
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
                className="bg-yellow-900 h-12 rounded-md hover:bg-yellow-800 fw-bold text-xl m-2"
              >
                Add Product +
              </button>
              <button
                type="submit"
                className="bg-yellow-900 h-12 rounded-md hover:bg-yellow-800 fw-bold text-xl m-2"
              >
                Edit Bill +
              </button>
            </div>
          </form>
          {billItems?.length > 0 && (
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
                {billItems?.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200"
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
