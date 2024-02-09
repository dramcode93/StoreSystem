import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './Products.module.css';
import { Translate, useLanguage } from 'translate-easy';
import LogOut from '../LogOut/LogOut';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
import ConfirmationModal from '../Category/ConfirmationModel';
import MainComponent from '../Aside/MainComponent';

const API_URL = 'https://ill-pear-abalone-tie.cyclic.app/api/products';
const API_category = 'https://ill-pear-abalone-tie.cyclic.app/api/categories/list';

const Products = () => {
  const token = localStorage.getItem('token');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedProductsId, setSelectedProductsId] = useState(null);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState('');
  const [loading, setLoading] = useState(true);
  const { selectedLanguage } = useLanguage();
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({});
  
  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const productsResponse = await axios.get(`${API_URL}?search=${searchTerm}&page=${pagination.currentPge}&limit=2`, { headers: { Authorization: `Bearer ${token}` } });
        setProducts(productsResponse.data.data);
        setPagination(productsResponse.data.paginationResult);
        const categoriesResponse = await axios.get(`${API_category}`, { headers: { Authorization: `Bearer ${token}` } });
        setCategories(categoriesResponse.data.data);
      } else {
        console.error('No token found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  }, [token, searchTerm, pagination.currentPge]);

  useEffect(() => {
    fetchData();
  }, [searchTerm, pagination.currentPge, fetchData]);

  const handleDeleteProduct = (productId) => {
    setSelectedProductsId(productId);
    setShowConfirmation(true);
  };

  const confirmDelete = useCallback(() => {
    axios
      .delete(`${API_URL}/${selectedProductsId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchData())
      .catch((error) => console.error('Error deleting product:', error))
      .finally(() => {
        setShowConfirmation(false);
        setSelectedProductsId(null);
      });
  }, [selectedProductsId, token, fetchData]);

  const cancelDelete = useCallback(() => {
    setShowConfirmation(false);
    setSelectedProductsId(null);
  }, []);

  const confirmAddProduct = useCallback(() => {
    axios
      .post(
        `${API_URL}`,
        { name: newProductName, price: newProductPrice, quantity: newProductQuantity, category: selectedCategoryId },
        { headers: { Authorization: `Bearer ${token}`} }
      )
      .then(() => fetchData())
      .catch((error) => console.error('Error adding product:', error))
      .finally(() => {
        setNewProductName('');
        setNewProductQuantity(0);  
        setNewProductPrice('');    
        setSelectedCategoryId(null);
      });
  }, [newProductName, newProductPrice, newProductQuantity, selectedCategoryId, token, fetchData]);

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      currentPge: newPage
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  return (
    <div>
      <LogOut />
      <MainComponent/>
      <div className={styles.container2}>
        <form className={styles.AddSection}>
          <select
            name="category"
            className={styles.inputField}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option disabled value=''>
              <Translate>Select Category</Translate>   
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="name"
            className={styles.inputField}
            placeholder="Product Name"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
          <input
            type="text"
            name="price"
            className={styles.inputField}
            placeholder="price"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
          />
          <input
            type="text"
            name="quantity"
            className={styles.inputField}
            placeholder='Quantity'
            value={newProductQuantity}
            onChange={(e) => setNewProductQuantity(e.target.value)}
          />
          <div>
            <input type="text" name="search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            <button className='btn btn-primary' onClick={handleSearch}>
              <Translate>Search</Translate>
            </button>
          </div>
        </form>
        <button onClick={confirmAddProduct} className={styles.addButton}>
          <Translate translations={{ ar: 'ضيف', en: 'Add' }}>
            {selectedLanguage === 'ar' ? 'ضيف' : 'Add'}
          </Translate>
        </button>
      </div>
      <div className={styles.container}>
        {loading && <div className="m-5 fs-3"><Loading /></div>}
        {!loading && (
          <>
            <div className={styles.categoryTable}>
              <table>
                <thead>
                  <tr>
                    <th><Translate>ID</Translate></th>
                    <th><Translate>Name</Translate></th>
                    <th><Translate>Category</Translate></th>
                    <th><Translate>Quantity</Translate></th>
                    <th><Translate>Price</Translate></th>
                    <th><Translate>Sold</Translate></th>
                    <th className='px-5'><Translate>Actions</Translate></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product._id.slice(-4)}</td>
                      <td>{product.name}</td>
                      <td>{product.category.name}</td>
                      <td>{product.quantity}</td>
                      <td>{product.price}</td>
                      <td>{product.sold}</td>
                      <td>
                        <Link to={`/updateProduct/${product._id}`} className={styles.updateBtn}>
                          <Translate translations={{ ar: 'تعديل', en: 'update' }}>
                            {selectedLanguage === 'ar' ? 'تعديل' : 'update'}
                          </Translate>
                        </Link>
                        <button className={styles.deleteBtn} onClick={() => handleDeleteProduct(product._id)}>
                          <Translate translations={{ ar: 'حذف', en: 'Delete' }}>
                            {selectedLanguage === 'ar' ? 'حذف' : 'Delete'}
                          </Translate>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ConfirmationModal show={showConfirmation} onConfirm={confirmDelete} onCancel={cancelDelete} />
              {products.length === 0 && <p>No categories available</p>}
            </div>
          </>
        )}
      </div>
      <div className={styles.flex}>
        {pagination.prev && (
          <button onClick={() => handlePageChange(pagination.prev)} className={styles.paginationNext}>
            {pagination.prev}
          </button>
        )}
        <button className={styles.paginationNext}><Translate>Page</Translate> {pagination.currentPge}</button>
        {pagination.next && (
          <button className={styles.paginationNext} onClick={() => handlePageChange(pagination.next)}>
            {pagination.next}
          </button>
        )}
      </div>
    </div>
  );
};

export default Products;
