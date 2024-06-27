import React, { useCallback, useState, useEffect } from "react";
import { useI18nContext } from "../context/i18n-context";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Loading from "../Loading/Loading";
import { SuccessAlert, ErrorAlert } from "../../form/Alert"; // Adjust the import path accordingly
import BlackLogo from "../Navbar/logo/Black-and-Gold-Sophisticated-Traditional-Fashion-Logo-(1).svg";

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
      const productsResponse = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProduct(productsResponse.data.data);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching data");
      ErrorAlert({ text: error.message || "Error fetching data" });
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
      SuccessAlert({ title: "Success", text: "Product added to cart!" });
    } catch (error) {
      console.error("Error adding Product:", error);
      setError(error.response?.data?.message || "Error adding product to cart");
      ErrorAlert({
        text: error.response?.data?.message || "Error adding product to cart",
      });
    }
  };

  return (
    <section
        className={` mx-10 p-10 absolute top-32 -z-50 w-3/4 secondary  ${
          language === "ar" ? "left-10" : "right-10"
        }`}
    >
      {loading ? (
        <div className="fs-4 text-center mb-5 pb-3 text-gray-500 dark:text-gray-400">
          <Loading />
        </div>
      ) : product ? (
        <div className=" ">
          <div className="flex mx-20 w-3/4 my-10 ">
            <div>
              <img
                src={product.images[0] || BlackLogo}
                alt={product.name}
                crossOrigin="anonymous"
                className="object-cover bg-black w-96  h-96 transition-transform duration-300 transform"
              />
            </div>
            <div>
              <h1 className="secondaryF font-bold mb-3 capitalize">{product.name}</h1>
              <div className="mx-3">
                <h4 className="secondaryF font-bold">{product?.description}</h4>
                <h4 className="secondaryF font-bold">
                  {product.sellingPrice}{" "}
                  <span className="text-orange-400">$</span>
                </h4>
                <h4 className="secondaryF font-bold">
                  Quantity: <span className="text-gray-600 font-semibold">{product.quantity}</span> 
                </h4>
                <h4 className="secondaryF font-bold">
                  Shop Name: <span className="text-gray-600 font-semibold">{product.shop.name}</span> 
                </h4>
                <h4 className="secondaryF font-bold">
                  Category: <span className="text-gray-600 font-semibold">{product.category.name}</span> 
                </h4>
                <h4 className="secondaryF font-bold">Sold: <span className="text-gray-600 font-semibold">{product.sold}</span></h4>

                <div className="mt-3">
                  <button
                    className="secondaryBtn w-56  "
                    onClick={() => handleAddtoCart()}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-white">Product not found</div>
      )}
    </section>
  );
};

export default PreviewProduct;
