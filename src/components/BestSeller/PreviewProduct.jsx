import React, { useCallback, useState, useEffect } from 'react';
import { useI18nContext } from "../context/i18n-context";
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Loading from '../Loading/Loading';

const PreviewProduct = () => {
    const { t, language } = useI18nContext();
    const { id } = useParams();
    const API_URL = "https://store-system-api.gleeze.com/api/products";
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

    return (
        <section className={`bg-gray-700 bg-opacity-25 mx-10 rounded-md pt-2 absolute top-32 -z-3 w-3/4 ${language === "ar" ? "left-10" : "right-10"}`}>
            {loading ? (
                <div className="fs-4 text-center mb-5 pb-3"><Loading /></div>
            ) : product ? (
                <div className=' flex justify-center items-center'>
                    <div className='flex mx-20 w-2/3 my-10'>
                        <div>
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                crossOrigin="anonymous"
                                className='object-cover w-96 rounded-sm h-96 transition-transform duration-300 transform bg-white'
                            />
                        </div>
                        <div>
                            <h2 className='text-white font-bold'>{product.name}</h2>
                            <h4 className='text-white font-bold'>{product.sellingPrice} <span className='text-yellow-400'>$</span></h4>
                            <h4 className='text-white font-bold'>Quantity: {product.quantity}</h4>
                            <h4 className='text-white font-bold'>Shop: {product.shop.name}</h4>

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
