import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useI18nContext } from "../context/i18n-context";
import AddSubShop from "../Shop/AddSubShop";
import ImageField from "../Shop/ImageField";
import NameField from "../Shop/NameField";
import TypeField from "../Shop/TypeField";
import PhoneField from "../profile/PhoneField";
import EditAddress from "./EditAddress";
import ActiveField from "./ActiveField";
import { useParams } from "react-router-dom";
import AddressField from "./AddressField";

const BranchInformation = () => {
  const token = Cookies.get("token");
  const { t, language } = useI18nContext();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [shopName, setShopName] = useState("");

  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isTypeEditing, setIsTypeEditing] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const [isPhoneEditing, setIsPhoneEditing] = useState(false);
  const [isDeletingPhone, setIsDeletingPhone] = useState(false);
  const [isAddingPhone, setIsAddingPhone] = useState(false);

  const [phones, setPhones] = useState([]);
  const [phone, setPhone] = useState();
  const [addresses, setAddresses] = useState([]);
  const [addressData, setAddressData] = useState();
  const [active, setActive] = useState("");
  const [shippingPriceOutside, setShippingPriceOutside] = useState();
  const [shippingPriceInside, setShippingPriceInside] = useState();
  const [deliveryService, setDeliveryService] = useState();
  const [deliveryServiceFromAPI, setDeliveryServiceFromAPI] = useState();

  const [isShippingPriceOutsideEditing, setIsShippingPriceOutsideEditing] =
    useState(false);

  const [isShippingPriceInsideEditing, setIsShippingPriceInsideEditing] =
    useState(false);

  const [isActiveEditing, setIsActiveEditing] = useState(false);
  const [isDeliveryServiceEditing, setIsDeliveryServiceEditing] =
    useState(false);

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const shopResponse = await axios.get(
          `https://store-system-api.gleeze.com/api/subShops/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const {
          name,
          phone,
          address,
          active,
          shippingPriceInside,
          shippingPriceOutside,
          deliveryService,
        } = shopResponse.data.data;
        setShopName(name);
        setPhones(phone);
        setAddresses(Array.isArray(address) ? address : [address]);
        setAddressData(address)
        setActive(active);
        setShippingPriceInside(shippingPriceInside);
        setShippingPriceOutside(shippingPriceOutside);
        setDeliveryService(deliveryService);
        setDeliveryServiceFromAPI(deliveryService)
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error fetching sub shop data:", error);
    } finally {
      setLoading(false);
    }
  }, [token,id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditToggle = () => {
    setIsNameEditing(!isNameEditing);
  };

  const handleNameChange = (e) => {
    if (isNameEditing) {
      setShopName(e.target.value);
    }
  };

  const handleSaveName = async () => {
    try {
      if (token) {
        await axios.put(
          `https://store-system-api.gleeze.com/api/subShops/${id}`,
          { name: shopName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShopName(shopName);
        setIsNameEditing(false);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error updating information:", error);
    }
  };

  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };

  const handleDelPhone = async (delPhone) => {
    console.log(delPhone)
    try {
      setIsDeletingPhone(true);
      if (token) {
        const response = await axios.delete(
           `https://store-system-api.gleeze.com/api/subShops/${id}/phone`,
          { data: { phone:delPhone }, headers: { Authorization: `Bearer ${token}` } }
        );
        setIsDeletingPhone(false);
        fetchData();
        setIsPhoneEditing(false)
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error deleting phone:", error);
      setIsDeletingPhone(false);
    }
  };


  const handlePhoneChange = (e) => {
    setPhone(e.target.value)
  };
  
  const handlePhoneAddToggle = () => {
    setIsPhoneEditing(!isPhoneEditing);
  };

  const handleAddPhone = async () => {
    console.log(phone)
    try {
      setIsAddingPhone(true);
      if (token) {
        const response = await axios.put(
          `https://store-system-api.gleeze.com/api/subShops/${id}/phone`,
          { phone:phone },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsAddingPhone(false);
        fetchData();
        setIsPhoneEditing(false)
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error adding phone:", error.response);
      setIsAddingPhone(false);
    }
  };

  const handleShippingPriceOutsideChange = (e) => {
    setShippingPriceOutside(e.target.value);
  };

  const handleSaveShippingPriceOutside = async () => {
    setLoading(true);
    try {
      if (token) {
        const response = await axios.put(
          `https://store-system-api.gleeze.com/api/subShops/${id}`,
          { shippingPriceOutside: shippingPriceOutside },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShippingPriceOutside(response.data.shippingPriceOutside);
        setIsShippingPriceOutsideEditing(false);
        fetchData();
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error updating shipping price outside:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShippingPriceInsideChange = (e) => {
    setShippingPriceInside(e.target.value);
  };

  const handleSaveShippingPriceInside = async () => {
    setLoading(true);
    try {
      if (token) {
        const response = await axios.put(
          `https://store-system-api.gleeze.com/api/subShops/${id}`,
          { shippingPriceInside: shippingPriceInside },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShippingPriceInside(response.data.shippingPriceInside);
        setIsShippingPriceInsideEditing(false);
        fetchData();
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error updating shipping price inside:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActiveChange = (e) => {
    setActive(e.target.value);
  };

  const handleAddActiveToggle = () => {
    setIsActiveEditing(!isActiveEditing);
  };

  const handleShippingPriceOutsideEitToggle = () => {
    setIsShippingPriceOutsideEditing(!isShippingPriceOutsideEditing);
  };

  const handleShippingPriceInsideEitToggle = () => {
    setIsShippingPriceInsideEditing(!isShippingPriceInsideEditing);
  };

  const handleSaveActiveChanges = async () => {
    try {
      if (token) {
        await axios.put(
          `https://store-system-api.gleeze.com/api/subShops/${id}/active`,
          { active: active },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setActive(active);
        setIsActiveEditing(false);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error updating information:", error);
    }
  };
  const handleDeliveryServiceChange = (e) => {
    setDeliveryService(e.target.value);
  };

  const handleAddDeliveryServiceToggle = () => {
    setIsDeliveryServiceEditing(!isDeliveryServiceEditing);
  };

  const handleSaveDeliveryServiceChanges = async () => {
    setLoading(true);
    try {
      if (token) {
        const response = await axios.put(
          `https://store-system-api.gleeze.com/api/subShops/${id}`,
          { deliveryService: deliveryService },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDeliveryService(response.data.deliveryService);
        setIsDeliveryServiceEditing(false);
        fetchData();
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error updating delivery service status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`mx-10 rounded-md py-4 absolute top-32 -z-3 w-3/4 ${
        language === "ar" ? "left-10" : "right-10"
      }`}
    >
      <EditAddress closeModal={toggleOpenCreateModal} modal={openCreate} addressData={addressData} />

      <NameField
        label={t("Information.Name")}
        value={shopName}
        isEditing={isNameEditing}
        inputValue={shopName}
        handleInputChange={handleNameChange}
        handleEditToggle={handleEditToggle}
        handleSaveChanges={handleSaveName}
      />

      <ActiveField
        label="Active State"
        value={active}
        handleInputChange={(e) => handleActiveChange(e)}
        isEditing={isActiveEditing}
        handleEditToggle={handleAddActiveToggle}
        handleSaveChanges={handleSaveActiveChanges}
        options={[
          { value: true, label: "Active" },
          { value: false, label: "Inactive" },
        ]}
      />
      <PhoneField
        label={t("Information.Phone")}
        value={phones}
        handleInputChange={handlePhoneChange}
        isEditing={isPhoneEditing}
        handleDelPhone={handleDelPhone}
        handleAddPhone={handleAddPhone}
        isLoading={isDeletingPhone || isAddingPhone}
        handleAddToggle={handlePhoneAddToggle}

      />

      <AddressField
        label={t("Information.Address")}
        values={addresses}
        openEdit={toggleOpenCreateModal}
      />

      <ActiveField
        label="Delivery Service"
        value={deliveryService}
        handleInputChange={(e) =>
          handleDeliveryServiceChange(e)
        }
        isEditing={isDeliveryServiceEditing}
        handleEditToggle={handleAddDeliveryServiceToggle}
        handleSaveChanges={handleSaveDeliveryServiceChanges}
        options={[
          { value: true, label: "True" },
          { value: false, label: "False" },
        ]}
      />
      {deliveryServiceFromAPI ? (
        <>
        <NameField
            label="Shipping Price Inside"
            value={shippingPriceInside}
            isEditing={isShippingPriceInsideEditing}
            inputValue={shippingPriceInside}
            handleInputChange={handleShippingPriceInsideChange}
            handleEditToggle={handleShippingPriceInsideEitToggle}
            handleSaveChanges={handleSaveShippingPriceInside}
          />
          <NameField
            label="Shipping Price Outside"
            value={shippingPriceOutside}
            isEditing={isShippingPriceOutsideEditing}
            inputValue={shippingPriceOutside}
            handleInputChange={handleShippingPriceOutsideChange}
            handleEditToggle={handleShippingPriceOutsideEitToggle}
            handleSaveChanges={handleSaveShippingPriceOutside}
          />
        </>
      ) : null}
    </section>
  );
};

export default BranchInformation;
