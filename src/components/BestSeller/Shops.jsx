import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Loading from '../Loading/Loading';
import { useI18nContext } from "../context/i18n-context";
import { useNavigate } from 'react-router-dom'

const Shops = () => {
    const API_URL = "https://store-system-api.gleeze.com/api/shops";
    const [shops, setShops] = useState([]);
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
                setShops(productsResponse.data.data);
            } else {
                throw new Error("No token found.");
            }
        } catch (error) {
            setError(error.message || "Error fetching data");
        } finally {
            setLoading(false);
        }
    }, [token, searchTerm]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <section className={`bg-gray-700 bg-opacity-25 mx-10 rounded-md pt-2 absolute top-32 -z-3 w-3/4 ${language === "ar" ? "left-10" : "right-10"}`}>
            <div>
                <h3 className="font-bold text-white text-5xl m-3">Shops</h3>
                {loading ? (
                    <div className="fs-4 text-center mb-5 pb-3 text-gray-500 dark:text-gray-400"><Loading /></div>
                ) : (
                    <div className='flex flex-wrap'>
                        {shops.map((shop) => (
                            <div key={shop._id} className='bg-gray-500 p-3 gap-2 bg-opacity-25 m-3 rounded-xl overflow-hidden relative '>
                                <div>
                                    <h3 className=' mt-2 text-white font-bold'>{shop.name}</h3>
                                    <h4 className=' mt-2 text-white font-bold'>Address:</h4>
                                    {shop.address.map((address, index) => (
                                        <div key={index} className='text-white font-bold mx-4 '>
                                            {`${address.street},  
            ${language === "ar" ? address.city?.city_name_ar : address.city?.city_name_en},  
            ${language === "ar" ? address.governorate?.governorate_name_ar : address.governorate?.governorate_name_en}`}
                                        </div>
                                    ))}
                                </div>
                                <div className='flex justify-center  mb-5 mx-2'>
                                    <button
                                        className="bg-yellow-900 rounded-full mt-3 hover:bg-yellow-800  fw-bold "
                                        onClick={() => { navigate(`/shopProduct/${shop._id}`) }}

                                    >
                                        Visit this shop
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

export default Shops;
