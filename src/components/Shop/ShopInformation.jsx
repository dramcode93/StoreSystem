import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useI18nContext } from "../context/i18n-context";
import TypeField from "./TypeField";
import NameField from "./NameField";
import AddSubShop from "./AddSubShop";
import ImageField from "./ImageField";
import { MaxImgAlert } from "../../form/Alert";

const ShopInformation = () => {
  const token = Cookies.get("token");
  const { t, language } = useI18nContext();
  const [loading, setLoading] = useState(true);
  const [shopName, setShopName] = useState("");
  const [type, setType] = useState([]);
  const [typeId, setTypeId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTypeEditing, setIsTypeEditing] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [inputImageValue, setInputImageValue] = useState("");
  const [image, setImage] = useState(null); 

  // Fetch shop data
  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const shopResponse = await axios.get(
          "https://store-system-api.gleeze.com/api/shops/myShop",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const { name, type, image } = shopResponse.data.data;
        setShopName(name);
        setType(type);
        setTypeId(type.map((t) => t._id).join(","));
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
        const response = await axios.put(
          "https://store-system-api.gleeze.com/api/shops/myShop/type",
          { type: typeId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setType(response.data.type);
        setTypeId("");
        setIsTypeEditing(false);
        fetchData(); 
      } else {
        console.error("No token found or input type is empty.");
      }
    } catch (error) {
      console.error("Error adding type:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteType = async (id) => {
    setLoading(true);
    try {
      if (token) {
        await axios.delete(
          "https://store-system-api.gleeze.com/api/shops/myShop/type",
          { data: { type: id }, headers: { Authorization: `Bearer ${token}` } }
        );
        fetchData();
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error deleting type:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setInputImageValue(URL.createObjectURL(file)); 
    }
  };

  const handleEditImage = () => {
    setIsImageEditing(!isImageEditing);
    setInputImageValue(imageUrl); 
  };

  const handleSaveImage = async () => {
    setLoading(true);
    try {
      if (token && image) {
        const formData = new FormData();
        formData.append("image", image);
        const response = await axios.put(
          `https://store-system-api.gleeze.com/api/shops/myShop`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setImageUrl(response.data.image);
        setIsImageEditing(false);
        fetchData();
      } else {
        console.error("No token found or no image uploaded.");
      }
    } catch (error) {
      console.error("Error updating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // bg-gray-700 bg-opacity-25
    <section
      className={` mx-10 rounded-md py-4 absolute top-32 -z-3 w-3/4 ${
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
      <ImageField
        label="Shop Image"
        value={imageUrl}
        isEditing={isImageEditing}
        handleInputChange={handleImageUpload}
        handleEditToggle={handleEditImage}
        handleSaveChanges={handleSaveImage}
        handleImageUpload={handleImageUpload}
        uploadedImage={inputImageValue}
        isLoading={loading}
      />
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
