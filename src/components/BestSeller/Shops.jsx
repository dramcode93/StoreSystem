import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Loading from '../Loading/Loading';
import { useI18nContext } from "../context/i18n-context";
import { useNavigate } from 'react-router-dom';
import { ErrorAlert } from '../../form/Alert';
import { IoIosArrowDropleft } from "react-icons/io";
import './styles.css';

const Shops = () => {
    const API_URL = "https://store-system-api.gleeze.com/api/shops";
    const API_URL_Type = "https://store-system-api.gleeze.com/api/shopTypes/list";
    const [shops, setShops] = useState([]);
    const [shopTypes, setShopTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState(null);
    const token = Cookies.get("token");
    const { t, language } = useI18nContext();
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const typeFilter = selectedType ? `type=${selectedType}` : "";
            const query = `sort=name&search=${searchTerm}&${typeFilter}`;
            const productsResponse = await axios.get(
                `${API_URL}?${query}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShops(productsResponse.data.data);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching data");
            ErrorAlert({ text: error.response?.data?.message || "Error fetching data" });
        } finally {
            setLoading(false);
        }
    }, [token, searchTerm, selectedType]);

    const fetchShopTypes = useCallback(async () => {
        try {
            const typesResponse = await axios.get(API_URL_Type, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShopTypes(typesResponse.data.data);
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching shop types");
            ErrorAlert({ text: error.response?.data?.message || "Error fetching shop types" });
        }
    }, [token]);

    useEffect(() => {
        fetchData();
        fetchShopTypes();
    }, [fetchData, fetchShopTypes]);

    const handleTypeChange = (typeId) => {
        setSelectedType(typeId);
    };

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
                                <div key={shop._id} className='bg-gray-500 p-2 w-72 h-96 bg-opacity-25 rounded-xl overflow-hidden relative m-3'>
                                    <img
                                        src={shop?.image}
                                        alt={shop?.name}
                                        crossOrigin="anonymous"
                                        className='object-cover border-spacing-2 border-blue-500 rounded-lg w-36 mx-auto mt-2 h-36 bg-white transition-transform duration-300 transform'
                                    />
                                    <div>
                                        <h3 className='mt-2 text-white font-bold text-center'>{shop?.name}</h3>
                                        <h4 className='mt-2 text-white font-bold text-center'>
                                            Type:
                                        </h4>
                                        <h4 className='mt-2 text-white font-bold text-center'>
                                            {shop?.type.map((type) => language === "ar" ? type.type_ar : type.type_en).join(', ')}
                                        </h4>
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
            <div className='filter-container bg-gray-700 bg-opacity-25 w-44 absolute top-32 p-3 '>
                <div className='flex w-full'>
                    <IoIosArrowDropleft className='text-white text-3xl mr-2' />
                    <div>
                        <h3 className="font-bold text-white text-xl mb-3">Filter by Type</h3>
                        <div className="mb-2 pr-4 flex w-2/3">
                            <input
                                type="radio"
                                name="typeFilter"
                                id='all'
                                checked={selectedType === null}
                                onChange={() => handleTypeChange(null)}
                            />
                            <label className="text-white w-10" htmlFor='all'>
                                All
                            </label>
                        </div>
                        {shopTypes.map((type) => (
                            <div key={type._id} className="mb-2 flex w-2/3">
                                <input
                                    type="radio"
                                    name="typeFilter"
                                    id={type.type_en}
                                    checked={type._id === selectedType}
                                    onChange={() => handleTypeChange(type._id)}
                                    className='m-0'
                                />
                                <label className="text-white w-10 text-capitalize" htmlFor={type.type_en}>
                                    {language === "ar" ? type.type_ar : type.type_en}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shops;
