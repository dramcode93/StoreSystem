import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Loading from '../Loading/Loading';
import { useI18nContext } from "../context/i18n-context";
import { useNavigate } from 'react-router-dom';
import { ErrorAlert } from '../../form/Alert'; // Adjust the import path accordingly

const Shops = () => {
    const API_URL = "https://store-system-api.gleeze.com/api/shops";
    const [shops, setShops] = useState([]);
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
            setShops(productsResponse.data.data);
            setError(null); // Clear any previous errors
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching data");
            ErrorAlert({ text: error.response?.data?.message || "Error fetching data" });
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
                    <div className='flex flex-wrap gap-x-4 gap-y-6'>
                        {shops.map((shop) => (
                            <div key={shop._id} className='bg-gray-500 p-2 w-72 h-80 bg-opacity-25 rounded-xl overflow-hidden relative m-3'>
                                <img
                                    src={shop.image}
                                    alt={shop.name}
                                    crossOrigin="anonymous"
                                    className='object-cover border-spacing-2 border-blue-500 rounded-lg w-36 mx-auto mt-2 h-36 bg-white transition-transform duration-300 transform'
                                />
                                <div>
                                    <h3 className='mt-2 text-white font-bold text-center'>{shop.name}</h3>
                                    <h4 className='mt-2 text-white font-bold text-center'>Type: {language === "ar" ? shop.type[0].type_ar : shop.type[0].type_en}</h4>
                                </div>
                                <div className='flex justify-center mb-5 mx-2'>
                                    <button
                                        className="bg-yellow-900 rounded-full mt-3 hover:bg-yellow-800 fw-bold"
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
        </section>
    );
};

export default Shops;
