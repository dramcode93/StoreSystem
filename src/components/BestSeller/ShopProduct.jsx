import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Loading from '../Loading/Loading';
import { useI18nContext } from "../context/i18n-context";
import { useNavigate, useParams } from 'react-router-dom';
import { SuccessAlert, ErrorAlert } from '../../form/Alert'; // Adjust the import path accordingly

const ShopProduct = () => {
    const API_URL = "https://store-system-api.gleeze.com/api/shops";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = Cookies.get("token");
    const { t, language } = useI18nContext();
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (token) {
                const productsResponse = await axios.get(
                    `${API_URL}/${id}/products/customers?sort=name`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setProducts(productsResponse.data.data);
                setError(null); // Clear any previous errors
            } else {
                throw new Error("No token found.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching data");
            ErrorAlert({ text: error.message || "Error fetching data" });
        } finally {
            setLoading(false);
        }
    }, [id, token]);

    const handleAddtoCart = async (productId) => {
        try {
            const response = await axios.post(
                "https://store-system-api.gleeze.com/api/cart",
                { productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Product added successfully:", response.data);
            SuccessAlert({ title: "Success", text: "Product added to cart!" });
        } catch (error) {
            console.error("Error adding Product:", error);
            setError(error.response?.data?.message || "Error adding product to cart");
            ErrorAlert({ text: error.response?.data?.message || "Error adding product to cart" });
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <section className={`bg-gray-700 bg-opacity-25 mx-10 rounded-md pt-2 absolute top-32 -z-3 w-4/5 ${language === "ar" ? "left-10" : "right-10"}`}>
            <div>
                {loading ? (
                    <div className="fs-4 text-center mb-5 pb-3 text-gray-500 dark:text-gray-400"><Loading /></div>
                ) : (
                    <div className='flex flex-wrap'>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product._id} className='w-1/5 h-96 bg-gray-500 bg-opacity-25 m-3 rounded-xl overflow-hidden relative '>
                                    <img
                                        src={product?.images[0]}
                                        alt={product?.name}
                                        crossOrigin="anonymous"
                                        className='object-cover border-spacing-2 border-blue-500 rounded-lg w-1/2 mx-auto mt-2 h-1/3 bg-white transition-transform duration-300 transform hover:scale-110'
                                    />
                                    <div>
                                        <p className='text-center mt-2 text-white text-xl font-bold'>{product?.name}</p>
                                        <p className='text-white text-center text-xl font-bold'>{product?.sellingPrice}$</p>
                                        <p className='text-white text-center text-xl font-bold'>Quantity: {product?.quantity}</p>
                                        <p className='text-white text-center text-xl font-bold'>Sold: <del>{product?.sold}</del></p>
                                    </div>
                                    <div className='flex justify-center mb-5 mx-2'>
                                        <button
                                            className="bg-yellow-900 rounded-full hover:bg-yellow-800 w-32 fw-bold"
                                            onClick={() => handleAddtoCart(product._id)}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            className="bg-pink-100 text-black rounded-full hover:bg-pink-300 w-32 fw-bold"
                                            onClick={() => { navigate(`/previewProduct/${product._id}`) }}
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='text-white m-3 text-center text-2xl font-bold'>
                                {t('No products available in this shop.')}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ShopProduct;
