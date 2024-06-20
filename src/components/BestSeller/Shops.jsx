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
    const [selectedTypes, setSelectedTypes] = useState([]);
    const token = Cookies.get("token");
    const { t, language } = useI18nContext();
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const typeFilter = selectedTypes.length > 0 ? `&type=${selectedTypes.join("&")}` : "";
            const productsResponse = await axios.get(
                `${API_URL}?sort=-sold name&search=${searchTerm}${typeFilter}`,
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
    }, [token, searchTerm, selectedTypes]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleTypeChange = (type) => {
        setSelectedTypes(prevSelectedTypes =>
            prevSelectedTypes.includes(type)
                ? prevSelectedTypes.filter(t => t !== type)
                : [...prevSelectedTypes, type]
        );
    };

    // Extract unique types for the checkboxes
    const uniqueTypes = Array.from(new Set(shops.flatMap(shop => shop.type.map(t => t.type_en))));

    return (
        <div>
            <section className={`bg-gray-700 bg-opacity-25 mx-10 rounded-md pt-2 absolute top-32 -z-3 w-3/4 ${language === "ar" ? "left-36" : "right-36"}`}>
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
            <div className='bg-gray-700 bg-opacity-25 h-2/3 w-44 absolute top-32 right-0 p-3'>
                <h3 className="font-bold text-white text-xl mb-3">Filter by Type</h3>
                {uniqueTypes.map((type) => (
                    <div key={type} className="mb-2">
                        <label className="text-white flex w-2/3 ">
                            <input
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                onChange={() => handleTypeChange(type)}
                                className='mx-2'
                            />
                            {type}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shops;
