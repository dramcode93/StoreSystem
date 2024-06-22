import React, { useCallback, useEffect, useState } from 'react';
import { useI18nContext } from '../context/i18n-context';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loading from '../Loading/Loading';
import { MdDelete } from 'react-icons/md';
import { LiaEditSolid } from 'react-icons/lia';
import { FaCheck } from 'react-icons/fa';
import { DeleteAlert, ErrorAlert } from '../../form/Alert';

const Cart = () => {
    const { t, language } = useI18nContext();
    const API_URL = 'https://store-system-api.gleeze.com/api/cart';
    const [products, setProducts] = useState([]);
    const [editingProducts, setEditingProducts] = useState({});
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const token = Cookies.get('token');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (token) {
                const productsResponse = await axios.get(`${API_URL}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProducts(productsResponse.data.data);
            } else {
                throw new Error('No token found.');
            }
        } catch (error) {
            ErrorAlert({ text: error.response?.data?.message || 'Error fetching data' });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteProduct = (productId) => {
        DeleteAlert({
            title: 'Are you sure you want to delete this product?',
            text: "You won't be able to revert this!",
            deleteClick: () => confirmDelete(productId),
        });
    };

    const confirmDelete = useCallback(
        (productId) => {
            axios
                .delete(`${API_URL}/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                    fetchData();
                })
                .catch((error) => {
                    ErrorAlert({ text: error.response?.data?.message || 'Error deleting product' });
                });
        },
        [token, fetchData]
    );

    const deleteAll = useCallback(() => {
        DeleteAlert({
            title: 'Are you sure you want to delete all products?',
            text: "You won't be able to revert this!",
            deleteClick: () => {
                axios
                    .delete(`${API_URL}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then(() => {
                        fetchData();
                    })
                    .catch((error) => {
                        ErrorAlert({ text: error.response?.data?.message || 'Error deleting products' });
                    });
            },
        });
    }, [token, fetchData]);

    const handleEditingQuantity = async (productId) => {
        try {
            if (token) {
                await axios.put(
                    `${API_URL}/${productId}`,
                    { productQuantity: quantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                throw new Error('No token found.');
            }
            setEditingProducts((prevState) => ({ ...prevState, [productId]: false }));
            fetchData();
        } catch (error) {
            ErrorAlert({ text: error.response?.data?.message || 'Error editing quantity' });
        } finally {
            setEditingProducts((prevState) => ({ ...prevState, [productId]: false }));
        }
    };

    const isEditingQuantity = (productId) => {
        setEditingProducts((prevState) => ({
            ...prevState,
            [productId]: true,
        }));
    };

    return (
        <div>
            <section
                className={`bg-gray-700 bg-opacity-25 mx-10 rounded-md pt-2 absolute top-32 -z-3 w-3/4 ${language === 'ar' ? 'left-10' : 'right-10'
                    }`}
            >
                <div className="flex justify-between">
                    <div className="w-96 m-3">
                        <h2 className="text-white font-bold">Shopping Cart</h2>
                    </div>
                    <div>
                        <button
                            className="bg-yellow-900 w-28 rounded-md m-3 hover:bg-yellow-800 fw-bold"
                            onClick={deleteAll}
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="fs-4 text-center mb-5 pb-3 text-gray-500 dark:text-gray-400">
                        <Loading />
                    </div>
                ) : products.cartItems && products.cartItems.length > 0 ? (
                    <div>
                        {products.cartItems.map((cartItem, index) => (
                            <div key={index} className="flex m-3 bg-gray-500 p-3 gap-2 bg-opacity-25 rounded-xl">
                                <img
                                    src={cartItem.product?.images[0]}
                                    alt={cartItem.product?.name}
                                    crossOrigin="anonymous"
                                    className="object-cover w-24 rounded-xl h-24 transition-transform duration-300 transform bg-white"
                                />

                                <div className="w-64">
                                    <p className="text-white text-2xl font-bold">{cartItem.product?.name}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xl font-bold">
                                        Category: {cartItem.product?.category.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-white text-2xl font-bold">Quantity</p>
                                    {editingProducts[cartItem.product?._id] ? (
                                        <div className="flex">
                                            <input
                                                className="px-4 py-2 w-24 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                type="number"
                                                onChange={(e) => setQuantity(e.target.value)}
                                                value={quantity}
                                            />
                                            <FaCheck
                                                className="text-white cursor-pointer text-center text-xl font-bold mx-1"
                                                onClick={() => handleEditingQuantity(cartItem.product?._id)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex mx-2">
                                            <p className="text-white text-center text-xl font-bold">
                                                {cartItem.productQuantity}
                                            </p>
                                            <LiaEditSolid
                                                onClick={() => {
                                                    isEditingQuantity(cartItem.product?._id);
                                                }}
                                                className="text-white cursor-pointer text-center text-xl font-bold mb-3"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="text-white text-2xl font-bold">Price</p>
                                    <p className="text-white text-center font-bold">{cartItem.product?.sellingPrice} $</p>
                                </div>
                                <div>
                                    <p className="text-white text-2xl font-bold">Total Price</p>
                                    <p className="text-white text-center font-bold">{cartItem?.totalPrice} $</p>
                                </div>
                                <div>
                                    <button onClick={() => handleDeleteProduct(cartItem?._id)}>
                                        <MdDelete className="text-white text-3xl font-bold" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="flex m-3 bg-gray-500 p-4 bg-opacity-25 rounded-xl">
                            <p className="text-white text-2xl font-bold">Total Cart Price:</p>
                            <p className="text-white text-2xl font-bold">{products?.totalCartPrice} $</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-white m-3 text-center text-2xl font-bold">No available products</div>
                )}
            </section>
        </div>
    );
};

export default Cart;
