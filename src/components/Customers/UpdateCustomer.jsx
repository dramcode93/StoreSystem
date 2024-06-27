import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useI18nContext } from "../context/i18n-context";
import FormNumber from "../../form/FormNumber";
import { X } from "@phosphor-icons/react";
import FormSelect from "../../form/FormSelect";
import FormInput from "../../form/FormInput";
import { FaRegSave } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";

function UpdateCustomer({ closeModal, role, modal, customerData }) {
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  const { t, language } = useI18nContext();
  const token = Cookies.get("token");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStreet, setNewStreet] = useState("");

  const [newSelectedGovernorate, setNewSelectedGovernorate] = useState("");
  const [newSelectedCity, setNewSelectedCity] = useState("");
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPhoneAdding, setIsPhoneAdding] = useState(false);
  const [isAddressAdding, setIsAddressAdding] = useState(false);

  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        const response = await axios.get(
          "https://store-system-api.gleeze.com/api/governorates"
        );
        setGovernorates(response.data.data);
        setLoading(false);
        if (modal) {
          setNewName(customerData.name);
          setNewPhone(customerData.phone[0]);
          setNewStreet(customerData.address[0].street);
          setNewSelectedGovernorate(customerData.address[0].governorate._id);
          setNewSelectedCity(customerData.address[0].city._id);
          fetchCities(customerData.address[0].governorate._id);
          // if (customerData?.address?.length) {
          //   customerData.address.forEach((address) => {
          //     fetchCities(address.governorate._id);
          //   });
          //   setNewName(customerData.name);
          //   setNewPhone(customerData.phone);
          //   setNewStreet(customerData.address.map((address) => address.street));
          //   setNewSelectedGovernorate(customerData.address.map((address) => address.governorate._id));
          //   setNewSelectedCity(customerData.address.map((address) => address.city._id));
          //   fetchCities(customerData.address.map((address) => address.governorate._id))
          // }
        }
      } catch (error) {
        console.error("Error fetching governorates:", error);
        setLoading(false);
      }
    };
    fetchGovernorates();
  }, [customerData, modal]);

  const fetchCities = async (governorateId) => {
    try {
      const response = await axios.get(
        `https://store-system-api.gleeze.com/api/cities?governorate=${governorateId}`
      );
      setCities(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setLoading(false);
    }
  };
  const handleGovernorateChange = (e) => {
    const selectedGovernorateId = e.target.value;
    setNewSelectedGovernorate(selectedGovernorateId);
    setNewSelectedCity("");
    fetchCities(selectedGovernorateId);
  };

  const handleEditCustomer = (e) => {
    e.preventDefault();
    axios
      .put(
        `https://store-system-api.gleeze.com/api/customers/${customerData._id}`,
        {
          name: newName,
          // phone: newPhone,
          // address: {
          //   governorate: newSelectedGovernorate, //this should pass governorate id
          //   city: newSelectedCity, //this should pass city id
          //   street: newStreet,
          // },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        window.location.href = "/customers";
      })
      .catch((error) => {
        console.error("Error updating customer:", error);
      });
  };

  const handleAddPhoneToggle = (field) => {
    setIsPhoneAdding(!isPhoneAdding);
    setNewPhone("");
  };
  const handleAddAddressToggle = (field) => {
    setIsAddressAdding(!isAddressAdding);
    setNewStreet("");
    setNewSelectedGovernorate("");
    setNewSelectedCity("");
  };

  const handleAddPhone = async () => {
    try {
      if (token) {
        const response = await axios.put(
          `https://store-system-api.gleeze.com/api/customers/${customerData._id}/phone`,
          { phone: newPhone },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsPhoneAdding(false);
        window.location.href = "/customers";
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error adding phone:", error.response);
    }
  };

  const handleDelPhone = async (index, e) => {
    axios
      .delete(
        `https://store-system-api.gleeze.com/api/customers/${customerData._id}/phone`,

        {
          data: { phone: customerData.phone[index] },
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        window.location.href = "/customers";
      })
      .catch((error) => {
        console.error("Error deleting phone:", error);
      });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await axios
        .put(
          `https://store-system-api.gleeze.com/api/customers/${customerData._id}/address`,
          {
            address: {
              governorate: newSelectedGovernorate,
              city: newSelectedCity,
              street: newStreet,
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          setIsAddressAdding(false);
          window.location.href = "/customers";
        });
      console.log("Customer added successfully:", response.data);
      closeModal();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };
  const handleDelAddress = async (index, e) => {
    const addressToDelete = {
      governorate: customerData.address[index].governorate._id,
      city: customerData.address[index].city._id,
      street: customerData.address[index].street,
    };

    console.log(addressToDelete)
    axios
      .delete(
        `https://store-system-api.gleeze.com/api/customers/${customerData._id}/address`,
        {
          data: { address: addressToDelete },
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        window.location.href = "/customers";
      })
      .catch((error) => {
        console.error("Error deleting address:", error);
      });
  };
  return (
    <div
      onClick={handleBackgroundClick}
      className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
      fixed top-1/2 -translate-x-1/2 -translate-y-1/2
      z-50 justify-center items-center ${modal ? "-right-1/2" : "-left-[100%]"}
       w-full h-full `}
    >
      <div
        className={`w-full max-w-min 
         sideModal duration-200 ease-linear
         ${
           language === "ar"
             ? "absolute left-0 rounded-r-xl"
             : "absolute right-0 rounded-l-xl"
         }
         h-screen overflow-y-auto overflow-x-hidden`}
      >
        <div className="relative p-4 sideModal sm:p-5">
          <div
            dir="rtl"
            className="flex justify-between items-center w-full pb-4  rounded-t border-b sm:mb-5 dark:border-gray-600"
          >
            <h3 className="text-xl font-bold mr-3 text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear">
              Edit Customer
            </h3>
            <button
              type="button"
              onClick={closeModal}
              className="w-fit text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 mr-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <X size={18} weight="bold" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form
            onSubmit={handleEditCustomer}
            className="fs-6 tracking-wider mt-4 p-0 gap-4 grid-cols-2"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <FormInput
              label="Name"
              name="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
            />
            <div className=" flex justify-center mt-9">
              <button
                disabled={!newName}
                className="secondaryBtn w-96 h-12 rounded-md  fw-bold text-xl "
              >
                Update Customer Name
              </button>
              <div>&nbsp;</div>
            </div>
          </form>
          {modal && customerData.phone ? (
            <div className="secondaryF font-bold text-2xl mt-5">
              <p className="secondaryF flex">
                Phone Number :
                {isPhoneAdding ? (
                  <FiX
                    className="cursor-pointer text-2xl text-red-500"
                    onClick={() => setIsPhoneAdding(!isPhoneAdding)}
                  />
                ) : null}
              </p>
              <div>
                {customerData.phone.length >= 1 ? (
                  <div>
                    {customerData.phone &&
                      customerData.phone.map((phone, index) => (
                        <div
                          key={index}
                          className="secondaryF flex w-1/2 text-xl"
                        >
                          <p className="secondaryF">{phone}</p>
                          <MdDelete
                            className="text-2xl mb-3 cursor-pointer"
                            color="red"
                            onClick={() => {
                              handleDelPhone(index);
                            }}
                          />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-xl secondaryF">No phones Added</div>
                )}
                {isPhoneAdding ? (
                  <div>
                    {/* <input
                      name="Phone"
                      className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
                      onChange={(e) => setNewPhone(e.target.value)}
                    /> */}
                    <FormNumber
                      placeholder="Phone"
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                    <FaRegSave
                      onClick={handleAddPhone}
                      className="text-2xl mt-2 cursor-pointer"
                    />
                  </div>
                ) : (
                  <IoMdAdd
                    onClick={handleAddPhoneToggle}
                    className="text-2xl cursor-pointer"
                  />
                )}
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {modal && customerData.address ? (
            <div className="secondaryF font-bold text-2xl mt-5">
              <p className="secondaryF flex">
                Address :
                {isAddressAdding ? (
                  <FiX
                    className="cursor-pointer text-2xl text-red-500"
                    onClick={() => setIsAddressAdding(!isAddressAdding)}
                  />
                ) : null}
              </p>
              <div>
                {customerData.address.length >= 1 ? (
                  <div>
                    {customerData.address &&
                      customerData.address.map((address, index) => (
                        <div
                          key={index}
                          className="secondaryF d-flex  gap-1 text-xl"
                        >
                          <p className="secondaryF">
                            {`${address.street},  
            ${
              language === "ar"
                ? address.city?.city_name_ar
                : address.city?.city_name_en
            },  
            ${
              language === "ar"
                ? address.governorate?.governorate_name_ar
                : address.governorate?.governorate_name_en
            }`}
                          </p>
                          <MdDelete
                            className="text-2xl mb-3 cursor-pointer"
                            color="red"
                            onClick={() => handleDelAddress(index)}
                          />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-xl text-gray-500">
                    No Addresses Aadded
                  </div>
                )}
                {isAddressAdding ? (
                  <div>
                    <FormInput
                      label="Street"
                      name="Street"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="Street"
                    />
                    <FormSelect
                      selectLabel="Governorate"
                      headOption="Select Governorate"
                      handleChange={handleGovernorateChange}
                      options={governorates.map((governorate) => ({
                        value: governorate._id,
                        label:
                          language === "ar"
                            ? governorate.governorate_name_ar
                            : governorate.governorate_name_en,
                      }))}
                      value={newSelectedGovernorate}
                      name="governorate"
                    />
                    <FormSelect
                      selectLabel="City"
                      headOption="Select City"
                      handleChange={(e) => {
                        setNewSelectedCity(e.target.value);
                      }}
                      options={cities.map((city) => ({
                        value: city._id,
                        label:
                          language === "ar"
                            ? city.city_name_ar
                            : city.city_name_en,
                      }))}
                      value={newSelectedCity}
                      name="city"
                    />
                    <FaRegSave
                      onClick={handleAddAddress}
                      className="text-2xl mt-2 cursor-pointer"
                    />
                  </div>
                ) : (
                  <IoMdAdd
                    onClick={handleAddAddressToggle}
                    className="text-2xl cursor-pointer"
                  />
                )}
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateCustomer;
