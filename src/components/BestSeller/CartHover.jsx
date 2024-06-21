import React, { useCallback, useEffect, useState } from 'react';
import { useI18nContext } from "../context/i18n-context";
import axios from 'axios';
import Cookies from 'js-cookie';
import Loading from '../Loading/Loading';
import { useNavigate } from 'react-router-dom';
const CartHover = () => {
    const { t, language } = useI18nContext();
    const API_URL = "https://store-system-api.gleeze.com/api/cart";
    const [products, setProducts] = useState([]);
    const [editingProducts, setEditingProducts] = useState({});
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const token = Cookies.get("token");
    const [isEditingProduct, setIsEditingProduct] = useState({});

    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (token) {
                const productsResponse = await axios.get(
                    `${API_URL}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setProducts(productsResponse.data.data);
            } else {
                throw new Error("No token found.");
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div>
            <div>
                Your Cart contain:

                {loading ? (
                    <div className="fs-4 text-center mb-5 pb-3 text-gray-500 dark:text-gray-400"><Loading /></div>
                ) : (
                    products.cartItems && products.cartItems.length > 0 ? (
                        <div>
                            {products.cartItems.map((cartItem, index) => (
                                <div key={index} className='flex m-2 bg-gray-200 p-1 gap-2 bg-opacity-25 rounded-xl'>
                                    <img
                                        src={cartItem.product.images[0]}
                                        alt={cartItem.product.name}
                                        crossOrigin="anonymous"
                                        className='object-cover w-20 rounded-xl h-20 transition-transform duration-300 transform bg-white'
                                    />

                                    <div className='w-64'>
                                        <p className='text-black text- font-bold'>{cartItem.product.name}</p>

                                    </div>
                                </div>))}
                            <button className='bg-orange-700 ' onClick={() => { navigate('/cart') }}
                            >Order Now</button>

                        </div>
                    ) : (
                        <div className='text-white m-3 text-center text-2xl font-bold'>No available products</div>
                    )
                )}
            </div>
        </div>
    );
}

export default CartHover;
