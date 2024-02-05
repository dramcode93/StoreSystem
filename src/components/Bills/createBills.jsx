import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BillForm = () => {
       const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    products: [],
    productQuantityMap: {},
    paidAmount: '',
  });

  const [productOptions, setProductOptions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Fetch product options from your server when the component mounts
    const fetchProductOptions = async () => {
      try {
        const response = await axios.get('https://rich-blue-moth-slip.cyclic.app/api/products/list', { headers: { Authorization: `Bearer ${token}` } });
setProductOptions(response.data.data);
      } catch (error) {
        console.error('Error fetching product options:', error);
      }
    };

    fetchProductOptions();
  }, [token]);

  const handleProductChange = (productId, quantity) => {
    const updatedProducts = [...formData.products, { product: productId, productQuantity: quantity }];
    setFormData({
      ...formData,
      products: updatedProducts,
    });

    // Calculate total amount
    const productPrice = productOptions.find((product) => product._id === productId)?.price || 0;
    const totalPrice = productPrice * quantity;
    setTotalAmount((prevTotalAmount) => prevTotalAmount + totalPrice);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://rich-blue-moth-slip.cyclic.app/api/bills', formData, { headers: { Authorization: `Bearer ${token}` } });
console.log('Bill created:', response.data.data);
      // Reset the form or perform any other necessary actions
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Customer Name:
        <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} required />
      </label>
      <br />

      <label>
        Phone:
        <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
      </label>
      <br />

      {formData.products.map((product, index) => (
        <div key={index}>
          <label>
            Product {index + 1}:
            <select
              value={product.product}
              onChange={(e) => handleProductChange(e.target.value, formData.productQuantityMap[product.product] || 0)}
            >
              <option value="" disabled>
                Select a product
              </option>
              {productOptions.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
            Quantity:
            <input
              type="number"
              value={formData.productQuantityMap[product.product] || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productQuantityMap: {
                    ...formData.productQuantityMap,
                    [product.product]: e.target.value,
                  },
                })
              }
            />
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setFormData({ ...formData, products: [...formData.products, {}] })}
      >
        Add Product
      </button>

      <br />

      <label>
        Paid Amount:
        <input
          type="number"
          name="paidAmount"
          value={formData.paidAmount}
          onChange={handleInputChange}
          required
        />
      </label>
      <br />

      <p>Total Amount: {totalAmount}</p>

      <button type="submit">Create Bill</button>
    </form>
  );
};

export default BillForm;
