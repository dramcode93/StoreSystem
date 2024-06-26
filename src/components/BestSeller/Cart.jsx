import React, { useCallback, useEffect, useState } from "react";
import { useI18nContext } from "../context/i18n-context";
import axios from "axios";
import Cookies from "js-cookie";
import Loading from "../Loading/Loading";
import { MdDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { FaCheck } from "react-icons/fa";
import { DeleteAlert, ErrorAlert, SuccessAlert } from "../../form/Alert";
import BlackLogo from "../Navbar/logo/Black-and-Gold-Sophisticated-Traditional-Fashion-Logo-(1).svg";
import FormSelect from "../../form/FormSelect";
import { Link } from "react-router-dom";
import FormPic from "../../form/FormPic";
import { FaTimesCircle } from 'react-icons/fa';
import { FiX } from "react-icons/fi";

const Cart = () => {
  const { t, language } = useI18nContext();
  const API_URL = "https://store-system-api.gleeze.com/api/cart";
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [onlinePayment, setOnlinePayment] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [shop, setShop] = useState(null);
  const [editingProducts, setEditingProducts] = useState({});
  const [selectedType, setSelectedType] = useState(null);
  const [selectedReceive, setSelectedReceive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [branchInfo, setBranchInfo] = useState([]);
  const [onFileChange, setOnFileChange] = useState("");

  const token = Cookies.get("token");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (token) {
        const productsResponse = await axios.get(`${API_URL}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = productsResponse.data.data;
        setProducts(cartData);

        if (cartData.cartItems.length > 0) {
          setShop(cartData.cartItems[0].product.shop._id);
        }

        const discountApplied = localStorage.getItem("discountApplied");
        if (discountApplied) {
          setDiscount(true);
        }
      } else {
        throw new Error("No token found.");
      }
    } catch (error) {
      console.log("Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const orderNow = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Selected Branch:", selectedBranch);
      if (selectedBranch === "") {
        ErrorAlert({ text: "You should choose a branch first!" });
      } else if (token) {
        await axios.post(
          "https://store-system-api.gleeze.com/api/order",
          {
            receivingMethod: selectedReceive,
            subShop: selectedBranch,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (selectedBranch === "") {
          ErrorAlert({ text: "You should choose a branch first!" });
        }
        setProducts([]);
        SuccessAlert({ title: "Success", text: "Your order done successfully" });

        localStorage.removeItem("discountApplied");
      } else {
        throw new Error("No token found.");
      }
    } catch (error) {
      ErrorAlert({
        text: error.response?.data?.message || "Error deleting product",
      });
    } finally {
      setLoading(false);
    }
  }, [token, selectedBranch, selectedReceive]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (shop) {
      fetchBranches();
    }
  }, [shop]);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      if (token) {
        const response = await axios.get(
          `https://store-system-api.gleeze.com/api/subShops/list?sort=name&active=true&shop=${shop}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBranches(response.data.data);
      } else {
        throw new Error("No token found.");
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (productId) => {
    DeleteAlert({
      title: "Are you sure you want to delete this product?",
      text: "You won't be able to revert this!",
      deleteClick: () => confirmDelete(productId),
    });
  };

  const confirmDelete = useCallback(
    (productId) => {
      axios
        .delete(`${API_URL}/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchData();
        })
        .catch((error) => {
          ErrorAlert({
            text: error.response?.data?.message || "Error deleting product",
          });
        });
    },
    [token, fetchData]
  );

  if (selectedType === "onlinePayment" && onlinePayment.length === 0) {
    ErrorAlert({
      text:
        selectedBranch === ""
          ? "You should choose a branch first!"
          : "This branch does not have available online methods",
    });
    setSelectedType("cash");
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "https://store-system-api.gleeze.com/api/Users/getMe",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserAddress(response.data.data.address[0].governorate._id || "shop");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [token]);

  console.log(userAddress)
  const deleteAll = useCallback(() => {
    DeleteAlert({
      title: "Are you sure you want to delete all products?",
      text: "You won't be able to revert this!",
      deleteClick: () => {
        axios
          .delete(`${API_URL}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            fetchData();
            setProducts([]);
            localStorage.removeItem("discountApplied"); // Clear discount state
          })
          .catch((error) => {
            ErrorAlert({
              text: error.response?.data?.message || "Error deleting products",
            });
          });
      },
    });
  }, [token, fetchData]);

  const handleEditingQuantity = async (productId) => {
    try {
      if (token) {
        await axios.put(
          `${API_URL}/${productId}`,
          { productQuantity: quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingProducts((prevState) => ({ ...prevState, [productId]: false }));
        fetchData();
      } else {
        throw new Error("No token found.");
      }
    } catch (error) {
      ErrorAlert({
        text: error.response?.data?.message || "Error editing quantity",
      });
    } finally {
      setEditingProducts((prevState) => ({ ...prevState, [productId]: false }));
    }
  };

  const isEditingQuantity = (productId) => {
    setEditingProducts((prevState) => ({
      ...prevState,
      [productId]: true,
    }));
  };

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);
    const selectedBranchObj = branches.find(
      (branch) => branch._id === branchId
    );
    if (selectedBranchObj) {
      setBranchInfo(selectedBranchObj)
      setShopAddress(selectedBranchObj.address.governorate._id)
      setOnlinePayment(selectedBranchObj.onlinePaymentMethods);
    }
  };

  console.log(branchInfo)

  const handleCoupon = (e) => {
    e.preventDefault();
    axios
      .put(
        "https://store-system-api.gleeze.com/api/cart/applyCoupon",
        {
          coupon: coupon,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        fetchData();
        setDiscount(true);
        setShowCouponInput(false);
        localStorage.setItem("discountApplied", true); // Save discount state
      })
      .catch((error) => {
        ErrorAlert({
          text: error.response?.data?.message || "This is invalid coupon",
        });
        setShowCouponInput(false);
      });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setOnFileChange(file ? file.name : "");
  };

  const handleRemoveImage = () => {
    setOnFileChange("");
  };
  return (
    <div>
      <section
        className={`mx-10 p-10 absolute top-32 -z-50 w-3/4 ${language === "ar" ? "left-10" : "right-10"
          }`}
      >
        <div className="flex justify-between">
          <div className="w-96 m-3">
            <h2 className="secondaryF font-bold">{t("Cart.ShoppingCart")}</h2>
          </div>
          <div>
            <button
              className="secondaryBtn w-28 m-3 fw-bold"
              onClick={deleteAll}
            >
              {t("Cart.ClearAll")}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="fs-4 text-center my-5 py-3 secondaryF ">
            <Loading />
          </div>
        ) : products.cartItems && products.cartItems.length > 0 ? (
          <div>
            {products.cartItems.map((cartItem, index) => (
              <div key={index} className="flex m-3 p-3 gap-2 secondary">
                <img
                  src={cartItem.product?.images[0] || BlackLogo}
                  alt={cartItem.product?.name}
                  crossOrigin="anonymous"
                  className="object-cover w-24  h-24 transition-transform duration-300 transform bg-black"
                />

                <div className="w-64">
                  <p className="secondaryF text-2xl font-bold">
                    {cartItem.product?.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xl font-bold">
                    {t("Cart.Category")} {cartItem.product?.category.name}
                  </p>
                </div>
                <div>
                  <p className="secondaryF text-2xl font-bold">
                    {t("Cart.Quantity")}
                  </p>
                  {editingProducts[cartItem.product?._id] ? (
                    <div className="flex">
                      <input
                        className="px-4 py-2 w-24 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="number"
                        onChange={(e) => setQuantity(e.target.value)}
                        value={quantity}
                      />
                      <FaCheck
                        className="secondaryF cursor-pointer text-center font-bold mx-1"
                        onClick={() =>
                          handleEditingQuantity(cartItem.product?._id)
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex mx-2">
                      <p className="secondaryF text-center text-xl font-bold">
                        {cartItem.productQuantity}
                      </p>
                      <LiaEditSolid
                        onClick={() => {
                          isEditingQuantity(cartItem.product?._id);
                        }}
                        className="secondaryF cursor-pointer text-center text-xl font-bold mb-3"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <p className="secondaryF text-2xl font-bold">
                    {t("Cart.Price")}
                  </p>
                  <p className="secondaryF text-center font-bold">
                    {cartItem.product?.sellingPrice} $
                  </p>
                </div>
                <div>
                  <p className="secondaryF text-xl font-bold">
                    {t("Cart.TotallPrice")}
                  </p>
                  <p className="secondaryF text-center font-bold">
                    {cartItem?.totalPrice} $
                  </p>
                </div>
                <div>
                  <button onClick={() => handleDeleteProduct(cartItem?._id)}>
                    <MdDelete className=" text-3xl font-bold" color="red" />
                  </button>
                </div>
              </div>
            ))}
            <div className=" secondary m-3 p-4">
              <div className="flex  ">
                <p className="secondaryF text-xl font-bold">
                  {t("Cart.TotalPrice")}
                </p>
                <p className="secondaryF text-xl font-bold">
                  {products?.totalCartPrice} $
                </p>
              </div>
              {discount && (
                <div className="flex  ">
                  <p className="secondaryF text-xl font-bold">
                    {t("Cart.TotalDiscount")}
                  </p>
                  <p className="secondaryF text-xl font-bold">
                    {products?.totalPriceAfterDiscount} $
                  </p>
                </div>
              )}
              {selectedReceive === "delivery" && selectedBranch !== "" && (
                <div className="flex  ">
                  <p className="secondaryF text-xl font-bold">
                    {t("Cart.shippingFees")}
                  </p>
                  <p className="secondaryF text-xl font-bold">
                    {userAddress === shopAddress ? branchInfo.shippingPriceInside : branchInfo.shippingPriceOutside} $
                  </p>
                </div>
              )}
              {selectedReceive === "delivery" && selectedBranch !== "" && (
                <div className="flex  ">
                  <p className="secondaryF text-xl font-bold">
                    {t("Cart.TotalBill")}
                  </p>
                  <p className="secondaryF text-xl font-bold">
                    {discount
                      ? products.totalPriceAfterDiscount +
                      (userAddress === shopAddress
                        ? branchInfo.shippingPriceInside
                        : branchInfo.shippingPriceOutside)
                      : products.totalCartPrice +
                      (userAddress === shopAddress
                        ? branchInfo.shippingPriceInside
                        : branchInfo.shippingPriceOutside)} $
                  </p>
                </div>
              )}
            </div>
            <div className="m-3 secondary p-4 ">
              <p className="secondaryF text-2xl font-bold">
                {t("Cart.orderInfo")}
              </p>
              <div className="mx-2 d-flex">
                <p className="secondaryF mt-4 mx-2 text-xl font-bold">
                  {t("Cart.selectBranch")}
                </p>
                <FormSelect
                  headOption="Select branch"
                  handleChange={handleBranchChange}
                  options={branches.map((branch) => ({
                    value: branch._id,
                    label: branch.name,
                  }))}
                  value={selectedBranch}
                  name="branch"
                />
              </div>
              <div className="mx-2">
                <p className="secondaryF mt-3 mr-2 text-xl font-bold">
                  {t("Cart.PaymentMethod")}
                </p>
                <div className="flex w-1/2">
                  <div className="d-flex w-1/2">
                    <input
                      type="radio"
                      name="paymentType"
                      className="secondaryF w-5"
                      id="cash"
                      checked={selectedType === "cash"}
                      onChange={() => setSelectedType("cash")}
                    />
                    <label
                      className="secondaryF mr-2 text-xl ml-2"
                      htmlFor="cash"
                    >
                      {t("Cart.cash")}
                    </label>
                  </div>
                  <div className="d-flex w-1/2">
                    <input
                      type="radio"
                      className="secondaryF w-5"
                      name="paymentType"
                      id="onlinePayment"
                      checked={selectedType === "onlinePayment"}
                      onChange={() => setSelectedType("onlinePayment")}
                    />
                    <label
                      className="secondaryF mr-2 text-xl ml-2"
                      htmlFor="onlinePayment"
                    >
                      {t("Cart.OnlinePayment")}
                    </label>
                  </div>
                </div>
              </div>
              <div className="mx-4 my-3">
                {selectedType === "onlinePayment" &&
                  onlinePayment.length > 0 && (
                    <div>
                      <div>
                        {onlinePayment.map((payment, index) => (
                          <div key={index} className="d-flex">
                            <li className="secondaryF mx-3 text-2xl">
                              {payment.name}:
                            </li>
                            <p className="secondaryF text-xl">
                              {payment.account}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="secondaryF text-xl">
                        {t("Cart.EnterAccount")}{" "}
                      </p>
                      <input
                        type="text"
                        className="border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></input>
                      <div className="d-flex mt-2">
                        <FormPic
                          label={t("Cart.UploadImage")}
                          name="Upload Image"
                          placeholder="Product Image"
                          onChange={handleFileChange}
                        />
                        {onFileChange && (
                          <div className="d-flex relative align-items-center">
                            <FaTimesCircle
                              className="text-red-600 cursor-pointer absolute top-0 right-0"
                              onClick={handleRemoveImage}
                            />
                            <p className="text-gray-600 mx-2 mt-3">{onFileChange}</p>
                          </div>
                        )}                        {onFileChange === "" && <p className="secondaryF text-xl mt-3 mx-2">
                          {t("Cart.Uploadpaymentproof")}
                        </p>}

                      </div>
                    </div>
                  )}
              </div>
              <div className="mx-2">
                <p className="secondaryF mt-3 mr-2 text-xl font-bold">
                  {t("Cart.receiveOrder")}
                </p>
                <div className="flex w-1/2">
                  <div className="d-flex w-1/2">
                    <input
                      type="radio"
                      name="receiveType"
                      className="secondaryF w-5"
                      id="delivery"
                      checked={selectedReceive === "delivery"}
                      onChange={() => setSelectedReceive("delivery")}
                    />
                    <label
                      className="secondaryF text-xl mr-2 ml-2"
                      htmlFor="delivery"
                    >
                      {t("Cart.Delivery")}
                    </label>
                  </div>
                  <div className="d-flex w-1/2">
                    <input
                      type="radio"
                      className="secondaryF w-5 "
                      name="receiveType"
                      id="shop"
                      checked={selectedReceive === "shop"}
                      onChange={() => setSelectedReceive("shop")}
                    />
                    <label
                      className="secondaryF mr-2 text-xl ml-2"
                      htmlFor="shop"
                    >
                      {t("Cart.Frombranch")}
                    </label>
                  </div>
                </div>
              </div>
              <div className="mx-2 mt-3">
                {!showCouponInput ? (
                  <Link
                    className="text-xl text-gray-600 hover:text-blue-600"
                    onClick={() => setShowCouponInput(true)}
                  >
                    {t("Cart.haveCopun")}
                  </Link>
                ) : (
                  <div className="relative ">
                    <FiX
                      className="text-2xl text-red-500 cursor-pointer absolute top-0 right-1/2 mx-4"
                      onClick={() => setShowCouponInput(false)}
                    />
                    <p className="secondaryF mt-3 mr-2 text-xl font-bold">
                      {t("Cart.Entercoupon")}
                    </p>
                    <div className="d-flex h-20">
                      <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="border border-transparent w-1/3  m-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        className="secondaryBtn cursor-pointer m-3 w-36  fw-bold"
                        onClick={handleCoupon}
                      >
                        {t("Cart.Submit")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                className="secondaryBtn cursor-pointer w-36 m-3 fw-bold"
                onClick={orderNow}
              >
                {t("Cart.OrderNow")}
              </button>
            </div>
          </div>
        ) : (
          <div className="secondary secondaryF m-3 p-8 text-center text-2xl font-bold">
            {t("Cart.noProduct")}
          </div>
        )
        }
      </section >
    </div >
  );
};

export default Cart;
