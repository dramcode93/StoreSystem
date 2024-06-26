import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useI18nContext } from "../context/i18n-context";
import NameField from "../Shop/NameField";
import PhoneField from "../profile/PhoneField";
import EditAddress from "./EditAddress";
import ActiveField from "./ActiveField";
import { useParams } from "react-router-dom";
import AddressField from "./AddressField";
import PaymentField from "./PaymentField";

const BranchInformation = () => {
  const token = Cookies.get("token");
  const { t, language } = useI18nContext();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [shopName, setShopName] = useState("");

  const [isNameEditing, setIsNameEditing] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const [isPhoneEditing, setIsPhoneEditing] = useState(false);
  const [isDeletingPhone, setIsDeletingPhone] = useState(false);
  const [isAddingPhone, setIsAddingPhone] = useState(false);

  const [isPaymentMethodEditing, setIsPaymentMethodEditing] = useState(false);
  const [isDeletingPaymentMethod, setIsDeletingPaymentMethod] = useState(false);
  const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false);

  const [phones, setPhones] = useState([]);
  const [phone, setPhone] = useState();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    name: "",
    account: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [addressData, setAddressData] = useState();
  const [active, setActive] = useState("");
  const [activeInput, setActiveInput] = useState("");

  const [shippingPriceOutside, setShippingPriceOutside] = useState();
  const [shippingPriceInside, setShippingPriceInside] = useState();

  const [deliveryService, setDeliveryService] = useState();
  const [deliveryServiceInput, setDeliveryServiceInput] = useState("");

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
          onlinePaymentMethods,
        } = shopResponse.data.data;
        setShopName(name);
        setPhones(phone);
        setAddresses(Array.isArray(address) ? address : [address]);
        setAddressData(address);
        setActive(active);
        setShippingPriceInside(shippingPriceInside);
        setShippingPriceOutside(shippingPriceOutside);
        setDeliveryService(deliveryService);
        setDeliveryServiceFromAPI(deliveryService);
        setPaymentMethods(onlinePaymentMethods);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error fetching sub shop data:", error);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

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
    try {
      setIsDeletingPhone(true);
      if (token) {
        const response = await axios.delete(
          `https://store-system-api.gleeze.com/api/subShops/${id}/phone`,
          {
            data: { phone: delPhone },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsDeletingPhone(false);
        fetchData();
        setIsPhoneEditing(false);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error deleting phone:", error);
      setIsDeletingPhone(false);
    }
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handlePhoneAddToggle = () => {
    setIsPhoneEditing(!isPhoneEditing);
  };

  const handleAddPhone = async () => {
    try {
      setIsAddingPhone(true);
      if (token) {
        const response = await axios.put(
          `https://store-system-api.gleeze.com/api/subShops/${id}/phone`,
          { phone: phone },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsAddingPhone(false);
        fetchData();
        setIsPhoneEditing(false);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error adding phone:", error.response);
      setIsAddingPhone(false);
    }
  };

  const handleDelPaymentMethod = async (delMethod) => {
    console.log(delMethod);
    try {
      setIsDeletingPaymentMethod(true);
      if (token) {
        const response = await axios.delete(
          `https://store-system-api.gleeze.com/api/subShops/${id}/payment`,
          {
            data: { onlinePaymentMethods: delMethod },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsDeletingPaymentMethod(false);
        fetchData();
        setIsPaymentMethodEditing(false);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error deleting Payment Method:", error);
      setIsDeletingPaymentMethod(false);
    }
  };

  const handlePaymentMethodChange = (e) => {
    const { name, value } = e.target;
    setNewPaymentMethod((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePaymentMethodAddToggle = () => {
    setIsPaymentMethodEditing(!isPaymentMethodEditing);
  };

  const handleAddPaymentMethod = async () => {
    try {
      console.log(newPaymentMethod)
              // Vodafone Cash
        // 01091548180
      setIsAddingPaymentMethod(true);
      if (token) {
        const response = await axios.put(
          `https://store-system-api.gleeze.com/api/subShops/${id}/payment`,
          { onlinePaymentMethods: newPaymentMethod },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsAddingPaymentMethod(false);
        fetchData();
        setIsPaymentMethodEditing(false);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error adding online Payment Method", error.response);
      setIsAddingPaymentMethod(false);
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
    setActiveInput(e.target.value);
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
    setDeliveryServiceInput(e.target.value);
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
      <EditAddress
        closeModal={toggleOpenCreateModal}
        modal={openCreate}
        addressData={addressData}
      />
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
        inputValue={activeInput}
        value={active}
        handleInputChange={(e) => handleActiveChange(e)}
        isEditing={isActiveEditing}
        handleEditToggle={handleAddActiveToggle}
        handleSaveChanges={handleSaveActiveChanges}
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
      <PaymentField
        label="Payment Method"
        value={paymentMethods}
        handleInputChange={handlePaymentMethodChange}
        isEditing={isPaymentMethodEditing}
        handleDelPaymentMethod={handleDelPaymentMethod}
        handleAddPaymentMethod={handleAddPaymentMethod}
        isLoading={isDeletingPaymentMethod || isAddingPaymentMethod}
        handleAddToggle={handlePaymentMethodAddToggle}
        newPaymentMethod={newPaymentMethod}
      />
      <AddressField
        label={t("Information.Address")}
        values={addresses}
        openEdit={toggleOpenCreateModal}
      />

      <ActiveField
        label="Delivery Service"
        inputValue={deliveryServiceInput}
        value={deliveryService}
        handleInputChange={(e) => handleDeliveryServiceChange(e)}
        isEditing={isDeliveryServiceEditing}
        handleEditToggle={handleAddDeliveryServiceToggle}
        handleSaveChanges={handleSaveDeliveryServiceChanges}
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
