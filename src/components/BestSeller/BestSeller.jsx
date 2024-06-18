import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Loading from '../Loading/Loading';
import { useI18nContext } from "../context/i18n-context";
import { useNavigate } from 'react-router-dom';
import { SuccessAlert, ErrorAlert } from '../../form/Alert';

const BestSeller = () => {
    const API_URL = "https://store-system-api.gleeze.com/api/products/customers";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const token = Cookies.get("token");
    const { t, language } = useI18nContext();
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {

            const productsResponse = await axios.get(
                `${API_URL}?sort=-sold name&search=${searchTerm}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProducts(productsResponse.data.data);
            setError(null);

        } catch (error) {
            setError(error.response?.data?.message || "Error fetching data");
            ErrorAlert({ text: error || "Error fetching data" });
        } finally {
            setLoading(false);
        }
    }, [token, searchTerm]);
    console.log(token)
    const handleAddtoCart = async (id) => {
        try {
            const response = await axios.post(
                "https://store-system-api.gleeze.com/api/cart",
                { productId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Product added successfully:", response.data);
            setError(null);
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
                <h3 className="font-bold text-white text-5xl m-3">Our <span className='text-blue-500 font'>Bestseller Products</span></h3>
                {loading ? (
                    <div className="fs-4 text-center mb-5 pb-3 text-gray-500 dark:text-gray-400"><Loading /></div>
                ) : (
                    <div className='flex flex-wrap'>
                        {products.map((product) => (
                            <div key={product._id} className='w-80 h-80 bg-gray-500 bg-opacity-25 m-3 rounded-xl overflow-hidden relative '>
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    crossOrigin="anonymous"
                                    className='object-cover border-spacing-2 border-blue-500 rounded-lg w-1/2 mx-auto mt-2 h-1/3 bg-white transition-transform duration-300 transform hover:scale-110'
                                />
                                <div>
                                    <p className='text-center mt-2 text-white text-xl font-bold'>{product.name}</p>
                                    <p className='text-white text-center text-xl font-bold'>{product.sellingPrice}$</p>
                                    <p className='text-white text-center text-xl font-bold'>{product.shop.name}</p>
                                </div>
                                <div className='flex justify-center mb-5 mx-2'>
                                    <button
                                        className="bg-yellow-900 rounded-full hover:bg-yellow-800 w-36 fw-bold"
                                        onClick={() => handleAddtoCart(product._id)}
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        className="bg-pink-100 text-black rounded-full hover:bg-pink-300 w-36 fw-bold"
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
        </section>
    );
};

export default BestSeller;
