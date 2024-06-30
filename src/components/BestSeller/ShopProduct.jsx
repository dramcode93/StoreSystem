import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Loading from "../Loading/Loading";
import { useI18nContext } from "../context/i18n-context";
import { useNavigate, useParams } from "react-router-dom";
import { SuccessAlert, ErrorAlert } from "../../form/Alert"; // Adjust the import path accordingly
import BlackLogo from "../Navbar/logo/Black-and-Gold-Sophisticated-Traditional-Fashion-Logo-(1).svg";

const ShopProduct = () => {
  const API_URL = "https://store-system-api.gleeze.com/api/shops";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");
  const { t, language } = useI18nContext();
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (token) {
        const productsResponse = await axios.get(
          `${API_URL}/${id}/products/customers?sort=name`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(productsResponse.data.data);
        setError(null); // Clear any previous errors
      } else {
        throw new Error("No token found.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching data");
      ErrorAlert({ text: error.message || "Error fetching data" });
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  const handleAddtoCart = async (productId) => {
    try {
      const response = await axios.post(
        "https://store-system-api.gleeze.com/api/cart",
        { productId },
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section
      className={` mx-10 p-10 absolute top-32 -z-50 w-3/4  ${language === "ar" ? "left-10" : "right-10"
        }`}
    >
      <div>
        {loading ? (
          <div className="fs-4 text-center mb-5 pb-3 text-gray-500 dark:text-gray-400">
            <Loading />
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  className="d-flex-2 text-center border-2 secondary"
                  key={product._id}
                  style={{
                    width: "320px",
                    boxShadow: "0 .3rem .5rem rgba(0, 0, 0, .1)",
                  }}
                >
                  <img
                    src={product?.images[0] || BlackLogo}
                    alt={product?.name}
                    crossOrigin="anonymous"
                    className="h-60 w-full object-cover bg-black"
                  />
                  <div>
                    <p className="secondaryF text-lg capitalize mt-2">
                      {product?.name}{" "}
                      <span className="text-gray-600">
                        {" "}
                        {product?.sellingPrice}$
                      </span>
                    </p>
                    <p className="secondaryF text-lg capitalize ">
                      {t("Cart.Quantity")}:{" "}
                      <span className="text-gray-600">{product?.quantity}</span>{" "}
                      {t("Cart.Sold")}: <del className="text-gray-600">{product?.sold}</del>
                    </p>
                  </div>
                  <div className="flex justify-center mb-3 mx-2">
                    <button
                      className="secondaryBtn w-32 fw-bold"
                      onClick={() => handleAddtoCart(product._id)}
                    >
                      {t("Cart.AddtoCart")}
                    </button>
                    <button
                      className="secondaryBtn2 w-32 fw-bold"
                      onClick={() => {
                        navigate(`/previewProduct/${product._id}`);
                      }}
                    >
                      {t("Cart.Preview")}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div
                className={`mx-10 p-10 absolute top-32 -z-50 w-3/4 secondary ${language === "ar" ? "left-10" : "right-10"
                  }`}
              >
                <div className="secondaryF m-3 text-center text-2xl font-bold mx-auto">
                  {t("Cart.NoProducts")}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopProduct;
