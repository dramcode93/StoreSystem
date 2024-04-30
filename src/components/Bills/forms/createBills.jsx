import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { X } from '@phosphor-icons/react';
import { FormSelect } from 'react-bootstrap';
import { useI18nContext } from '../../context/i18n-context';
import FormNumber from '../../../form/FormNumber';
import FormInput from '../../../form/FormInput';

const API_PRODUCTS_URL = 'https://store-system-api.gleeze.com/api/products/list';
const API_CUSTOMERS_URL = 'https://store-system-api.gleeze.com/api/customers';
const API_BILLS_URL = 'https://store-system-api.gleeze.com/api/bills';

const CreateBills = ({ closeModal, modal }) => {
  const token = Cookies.get('token');
  const { t, language } = useI18nContext();

  const [customerId, setCustomerId] = useState('customerId');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paidAmount, setPaidAmount] = useState('2000');
  const [customerAddress, setCustomerAddress] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([
    { productId: '6612c7028e3ed58da136034f', quantity: '8' },
    { productId: '6612c6f28e3ed58da136034b', quantity: '2' }
  ]);

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        setLoading(true);
        const [productsResponse, customersResponse] = await Promise.all([
          axios.get(API_PRODUCTS_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(API_CUSTOMERS_URL, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setProducts(productsResponse.data.data);
        setCustomers(customersResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

      if (!customerId || !phoneNumber || !customerAddress) {
        console.error('Customer information is incomplete');
        return;
      }

      const requestBody = {
        customerId,
        phone: phoneNumber,
        products: selectedProducts,
        paidAmount: Number(paidAmount),
        customerAddress
      };

      const response = await axios.post(API_BILLS_URL, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('response', response);


      setCustomerId('');
      setPhoneNumber('');
      setPaidAmount('');
      setCustomerAddress('');
      setSelectedProducts([]);
      window.location.href = '/bills'; // Redirect to bills page after successful submission
    } catch (error) {
      console.error('Error creating bill:', error);
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
                Add Category
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
              <FormInput
                label="customerId"
                name="customerId"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="customerId"
              />

              <FormInput
                label="Address"
                name="address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Address"
              />

              <FormNumber
                label="Phone"
                name="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone"
              />

              <FormNumber
                label="Paid Amount"
                name="paidAmount"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="Paid Amount"
              />

              <FormSelect
                label="Select Product"
                name="product"
                onChange={(e) => setSelectedProducts([...selectedProducts, { productId: e.target.value, quantity: '' }])}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </FormSelect>

              <FormSelect
                label="Select Customer"
                name="customer"
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer.name}>
                    {customer.name}
                  </option>
                ))}
              </FormSelect>

              <div className="col-span-2 flex justify-center">
                <button
                  type="submit"
                  className="bg-yellow-900 w-1/2 h-12 rounded-md hover:bg-yellow-800 fw-bold text-xl"
                >
                  {t("Products.AddProduct")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBills;
