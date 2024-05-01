import { useEffect, useState } from "react";
import { Plus, X } from "@phosphor-icons/react";
import FormBtnIcon from "../../form/FormBtnIcon";
import FormInput from "../../form/FormInput";
import { useI18nContext } from "../context/i18n-context";
import FormSelect from "../../form/FormSelect";
import FormNumber from "../../form/FormNumber";
import axios from "axios";
import Cookies from "js-cookie";

export default function AddCustomer({ closeModal, role, modal }) {
  useEffect(() => {}, []);
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const { t, language } = useI18nContext();
  const token = Cookies.get("token");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        const response = await axios.get(
          "https://store-system-api.gleeze.com/api/governorates"
        );
        setGovernorates(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching governorates:", error);
        setLoading(false);
      }
    };
    fetchGovernorates();
  }, []);

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
    setSelectedGovernorate(selectedGovernorateId);
    setSelectedCity("");
    fetchCities(selectedGovernorateId);
  };
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await axios
        .post(
          "https://store-system-api.gleeze.com/api/customers",
          {
            name,
            phone,
            address: {
              governorate: selectedGovernorate,
              city: selectedCity,
              street,
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          window.location.href = "/customers";
        });
      console.log("Customer added successfully:", response.data);
      closeModal();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };
  return (
    <>
      <div
        onClick={handleBackgroundClick}
        className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
        absolute top-1/2 -translate-x-1/2 -translate-y-1/2
        z-50 justify-center items-center ${modal ? "left-1/2" : "-left-[100%]"}
         bg-opacity-40 w-full h-full `}
      >
        <div
          className={`CreateCenter w-full max-w-min 
           dark:bg-gray-800 rounded-r-xl duration-200 ease-linear
           ${modal ? "absolute left-0" : "absolute -left-[100%]"}
           h-screen overflow-auto`}
        >
          <div className="relative p-4 dark:bg-gray-800 sm:p-5">
            <div
              dir="rtl"
              className="flex justify-between items-center w-full pb-4  rounded-t border-b sm:mb-5 dark:border-gray-600"
            >
              <h3 className="text-xl font-bold mr-3 text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear">
                Add Customer
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
              onSubmit={handleAddCustomer}
              className="fs-6 tracking-wider mt-4 p-0 gap-4 grid-cols-2"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <FormInput
                label="Name"
                name="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
              <FormNumber
                label="Phone Number"
                name="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
              />
              <FormInput
                label="Street"
                name="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
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
                value={selectedGovernorate}
                name="governorate"
              />
              {selectedGovernorate ? (
                <FormSelect
                  selectLabel="City"
                  headOption="Select City"
                  handleChange={(e) => {
                    setSelectedCity(e.target.value);
                  }}
                  options={cities.map((city) => ({
                    value: city._id,
                    label:
                      language === "ar" ? city.city_name_ar : city.city_name_en,
                  }))}
                  value={selectedCity}
                  name="city"
                />
              ) : (
                <div className="w-80"></div>
              )}
              <div className=" flex justify-center mt-9">
                <button
                  disabled={
                    !name ||
                    !phone ||
                    !selectedGovernorate ||
                    !selectedCity ||
                    !street
                  }
                  className="bg-yellow-900 w-96 h-12 rounded-md hover:bg-yellow-800 fw-bold text-xl"
                >
                  Add Customer +
                </button>
                <div>&nbsp;</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
