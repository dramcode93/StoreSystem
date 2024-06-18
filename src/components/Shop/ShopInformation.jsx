import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useI18nContext } from "../context/i18n-context";
import TypeField from "./TypeField";
import NameField from "./NameField";
import AddSubShop from "./AddSubShop";
import { Plus } from "@phosphor-icons/react";

const ShopInformation = () => {
  const token = Cookies.get("token");
  const { t, language } = useI18nContext();
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState(0);
  const [shopName, setShopName] = useState("");
  const [type, setType] = useState([]);
  const [typeId, setTypeId] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTypeEditing, setIsTypeEditing] = useState(false);
  // const [inputType, setInputType] = useState("");

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const shopResponse = await axios.get(
          "https://store-system-api.gleeze.com/api/shops/myShop",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const { debts, name, type, image } = shopResponse.data.data;
        setDebts(debts);
        setShopName(name);
        setType(type);
        setTypeId(type.map((t) => t._id));
        setImageUrl(image);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditToggle = () => {
    setIsNameEditing(!isNameEditing);
    setInputValue(shopName);
  };
  const handleAddToggle = () => {
    setIsTypeEditing(!isTypeEditing);
  };

  const handleNameChange = (e) => {
    if (isNameEditing) {
      setInputValue(e.target.value);
    }
  };
  const handleTypeChange = (e) => {
    if (isTypeEditing) {
      setTypeId(e.target.value);
    }
  };

  const handleSaveName = async () => {
    try {
      if (token) {
        await axios.put(
          `https://store-system-api.gleeze.com/api/shops/myShop`,
          { name: inputValue },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShopName(inputValue);
        setIsNameEditing(false);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error updating information:", error);
    }
  };

  const handleAddType = async () => {
    setLoading(true);
    try {
      if (token && typeId) {
        console.log(typeId);
        const response = await axios.put(
          "https://store-system-api.gleeze.com/api/shops/myShop/type",
          { type: typeId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setType(response.data.type);
        setTypeId("");
        setIsTypeEditing(false);
        console.log("Type added successfully:", response.data);
        fetchData();
        setLoading(false);
      } else {
        console.error("No token found or input type is empty.");
      }
    } catch (error) {
      console.error("Error adding type:", error);
      setLoading(false);
    }
  };

  const handleDeleteType = async (id) => {
    console.log(id);
    console.log(token);
    setLoading(true);
    try {
      if (token) {
        const response = await axios.delete(
          "https://store-system-api.gleeze.com/api/shops/myShop/type",
          { data: { type: id }, headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Type deleted successfully:", response.data);
        fetchData();
        setLoading(false);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error deleting type:", error);
      setLoading(false);
    }
  };

  const [openCreate, setOpenCreate] = useState(false);
  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };

  return (
    <section
      className={`bg-gray-700 bg-opacity-25 mx-10 rounded-md py-4 absolute top-32 -z-3 w-3/4 ${
        language === "ar" ? "left-10" : "right-10"
      }`}
    >
      <AddSubShop closeModal={toggleOpenCreateModal} modal={openCreate} />
      <div>
        <button
          className="bg-yellow-900 w-40 rounded-md hover:bg-yellow-800 fw-bold mx-10 my-4"
          onClick={toggleOpenCreateModal}
        >
          Add Sub Shop
        </button>
      </div>
      {/* <img
        src={imageUrl}
        alt="shop"
        className="max-w-full h-20 rounded-md"
        crossOrigin="anonymous"
      /> */}
      <NameField
        label={t("Information.Name")}
        value={shopName}
        isEditing={isNameEditing}
        inputValue={inputValue}
        handleInputChange={handleNameChange}
        handleEditToggle={handleEditToggle}
        handleSaveChanges={handleSaveName}
      />

      <TypeField
        label="Shop Type"
        value={type}
        handleInputChange={handleTypeChange}
        isEditing={isTypeEditing}
        handleDelType={handleDeleteType}
        handleAddType={handleAddType}
        handleAddToggle={handleAddToggle}
        isLoading={loading}
      />
    </section>
  );
};

export default ShopInformation;
