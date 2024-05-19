import React, { useCallback, useState, useEffect } from 'react';
import { useI18nContext } from "../context/i18n-context";
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Loading from '../Loading/Loading';

const PreviewProduct = () => {
    const { language } = useI18nContext();
    const { id } = useParams();
    const API_URL = "https://store-system-api.gleeze.com/api/products/customers";
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = Cookies.get("token");

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (token) {
                const productsResponse = await axios.get(
                    `${API_URL}/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setProduct(productsResponse.data.data);
            } else {
                throw new Error("No token found.");
            }
        } catch (error) {
            setError(error.message || "Error fetching data");
        } finally {
            setLoading(false);
        }
    }, [id, token]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const handleAddtoCart = async () => {
        try {
            const response = await axios.post(
                "https://store-system-api.gleeze.com/api/cart",
                { productId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Product added successfully:", response.data);
        } catch (error) {
            console.error("Error adding Product:", error);
            setError(error.response?.data?.message || "Error adding product to cart");

        }
    };

    return (
        <section className={`bg-gray-700 bg-opacity-25 mx-10 rounded-md pt-2 absolute top-1/4 -z-3 w-3/4 ${language === "ar" ? "left-10" : "right-10"}`}>
            {loading ? (
                <div className="fs-4 text-center mb-5 pb-3 text-gray-500 dark:text-gray-400"><Loading /></div>
            ) : product ? (
                <div className=' '>
                    {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                    <div className='flex mx-20 w-3/4 my-10 '>
                        <div>
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                crossOrigin="anonymous"
                                className='object-cover w-96 rounded-xl h-96 transition-transform duration-300 transform bg-white'
                            />
                        </div>
                        <div>
                            <h1 className='text-white font-bold mb-3'>{product.name}</h1>
                            <div className='mx-3'>
                                <h4 className='text-white font-bold'>{product?.description}</h4>
                                <h4 className='text-white font-bold'>{product.sellingPrice} <span className='text-yellow-400'>$</span></h4>
                                <h4 className='text-white font-bold'>Quantity: {product.quantity}</h4>
                                <h4 className='text-white font-bold'>Shop: {product.shop.name}</h4>
                                <h4 className='text-white font-bold'>Shop address:</h4>
                                {product.shop.address.map((address, index) => (
                                    <div key={index} className='text-white font-bold mx-4 text-2xl'>
                                        {`${address.street},  
            ${language === "ar" ? address.city?.city_name_ar : address.city?.city_name_en},  
            ${language === "ar" ? address.governorate?.governorate_name_ar : address.governorate?.governorate_name_en}`}
                                    </div>
                                ))}

                                <div className='mt-3'>
                                    <button
                                        className="bg-yellow-900 rounded-full hover:bg-yellow-800 w-56 fw-bold "
                                        onClick={() => handleAddtoCart(product._id)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='text-white'>Product not found</div>
            )}
        </section>
    );
};

export default PreviewProduct;
