import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import FormInput from "../../form/FormInput";
import { useI18nContext } from "../context/i18n-context";
import FormSelect from "../../form/FormSelect";
import FormNumber from "../../form/FormNumber";
import axios from "axios";
import Cookies from "js-cookie";

export default function CreateUser({ closeModal, role, modal }) {
  useEffect(() => {}, []);
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }; 

  const { t, language } = useI18nContext();
  const token = Cookies.get("token");
  const [username, setUserName] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");
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
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://store-system-api.gleeze.com/api/Users",
        {
          username: username,
          name: name,
          password: password,
          passwordConfirmation: passwordConfirmation,
          email: email,
          phone: phone,
          address: {
            governorate: selectedGovernorate,
            city: selectedCity,
            street: street,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closeModal();
      window.location.href = "/Users";
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <>
      <div
        onClick={handleBackgroundClick}
        className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
          fixed top-1/2 -translate-x-1/2 -translate-y-1/2
          z-50 justify-center items-center ${
            modal ? "-right-1/2" : "-left-[100%]"
          }
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
                {t("Users.AddUser")}
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
              onSubmit={handleAddUser}
              className="fs-6 tracking-wider mt-4 p-0 gap-4 grid-cols-2"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <FormInput
                label={t("Users.Username")}
                name="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={t("Users.Username")}
              />
              <FormInput
                label={t("Users.Name")}
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("Users.Name")}
              />
              <FormInput
                label={t("Users.Password")}
                name="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("Users.Password")}
              />
              <FormInput
                label={t("Users.ConfirmPassword")}
                name="Confirm Password"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder={t("Users.ConfirmPassword")}
              />
              <FormInput
                label="Email"
                name="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <FormNumber
                label={t("Users.Phone")}
                name="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("Users.Phone")}
              />
              <FormInput
                label={t("Users.Street")}
                name="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder={t("Users.Street")}
              />
              <FormSelect
                selectLabel={t("Users.Governorate")}
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
                  selectLabel={t("Users.City")}
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
                    !username ||
                    !password ||
                    !passwordConfirmation ||
                    !email ||
                    !phone ||
                    !selectedGovernorate ||
                    !selectedCity ||
                    !street
                  }
                  className="secondaryBtn w-96 h-12 rounded-md  fw-bold text-xl "
                  >
                  {t("Users.AddUser")} +
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
