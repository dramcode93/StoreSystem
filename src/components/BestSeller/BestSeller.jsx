import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Loading from '../Loading/Loading';
import { useI18nContext } from "../context/i18n-context";
import { useNavigate } from 'react-router-dom'

const BestSeller = () => {
    const API_URL = "https://store-system-api.gleeze.com/api/products/customers";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const token = Cookies.get("token");
    const { t, language } = useI18nContext();
    const navigate = useNavigate()

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (token) {
                const productsResponse = await axios.get(
                    `${API_URL}?sort=-sold name&search=${searchTerm}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setProducts(productsResponse.data.data);
            } else {
                throw new Error("No token found.");
            }
        } catch (error) {
            setError(error.message || "Error fetching data");
        } finally {
            setLoading(false);
        }
    }, [token, searchTerm]);

    const handleAddtoCart = async (id) => {
        try {
            const response = await axios.post(
                "https://store-system-api.gleeze.com/api/cart",
                { productId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            window.location.href = "/best-seller";
            console.log("Product added successfully:", response.data);
        } catch (error) {
            console.error("Error adding Product:", error);
            setError(error.message || "Error fetching data");
        }
    };
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <section className={`bg-gray-700 bg-opacity-25 mx-10 rounded-md pt-2 absolute top-32 -z-3 w-3/4 ${language === "ar" ? "left-10" : "right-10"}`}>
            <div>
                <h3 className="font-bold text-white text-5xl">Our <span className='text-blue-500 font'>Bestseller Products</span></h3>
                {loading ? (
                    <div className="fs-4 text-center mb-5 pb-3 text-gray-500 dark:text-gray-400"><Loading /></div>
                ) : (
                    <div className='flex flex-wrap'>
                        {products.map((product) => (
                            <div key={product._id} className='w-80 h-96 bg-slate-900 m-3 rounded-xl overflow-hidden relative '>
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    crossOrigin="anonymous"
                                    className='object-cover w-full h-1/2 transition-transform duration-300 transform hover:scale-110'
                                />
                                <div>
                                    <p className='text-center mt-2 text-white text-xl font-bold'>{product.name}</p>
                                    <p className='text-white text-center text-xl font-bold'>{product.sellingPrice}$</p>
                                    <p className='text-white text-center text-xl font-bold'>{product.shop.name}</p>
                                </div>
                                <div className='flex justify-center  mb-5 mx-2'>
                                    <button
                                        className="bg-yellow-900 rounded-full hover:bg-yellow-800 w-36 fw-bold "
                                        onClick={() => handleAddtoCart(product._id)}
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        className="bg-pink-100  text-black rounded-full hover:bg-pink-300  w-36 fw-bold "
                                        onClick={() => { navigate(`/previewProduct/${product._id}`) }}
                                    >
                                        Preview
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section >
    );
};

export default BestSeller;
