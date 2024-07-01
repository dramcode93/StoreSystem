import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Eye, EyeClosed } from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
import { Link } from "react-router-dom";
import FormSelect from "../../form/FormSelect";
import FormInput from "../../form/FormInput";

const SignUp = (closeModal) => {
  const { language, t } = useI18nContext();
  const token = Cookies.get("token");
  const [username, setUsername] = useState("");
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [msgExist, setMsgExist] = useState("");
  const [usernameInputTouched, setUsernameInputTouched] = useState(false);

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

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios
        .post(
          "https://store-system-api.gleeze.com/api/auth/signup",
          {
            username,
            name,
            password,
            passwordConfirmation,
            email,
            phone,
            address: {
              governorate: selectedGovernorate,
              city: selectedCity,
              street: street,
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          window.location.href = "/";
        });
      closeModal();
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCheckUserName = async (e) => {
    try {
      const response = await axios.post(
        "https://store-system-api.gleeze.com/api/auth/checkUsername",
        {
          username: username,
        }
      );
      setLoading(true);
      setMsgExist(
        language === "ar"
          ? response.data.data[1]?.ar
          : response.data.data[0]?.en
      );
      setLoading(false);
    } catch (error) {
      console.error("Error adding user:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    handleCheckUserName();
  });
  return (
    <div className="pt-2 absolute top-20 flex min-w-full">
      <div
        className="secondary w-1/2  border-2 parentDiv rounded-xl shadow-md "
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex flex-col gap-1 p-2 pl-5 items-center ">
          <h1 className="font-medium text-base">
            {usernameError || passwordError}
          </h1>
          <h1 className="font-medium text-center pdarkForm plightForm text-2xl secondaryF">
            {t("Home.Signup")}
          </h1>
        </div>
        <form
          onSubmit={handleSignUp}
          className="p-4 pt-0 darkForm lightForm relative m-0 gap-0"
        >
          <div className="space-y-8">
            <div className="right-1 gap-4 flex">
              <div className="w-80 ">
                {/* <FormInput
                  label={language === "en" ? "Username" : t("Home.Username")}
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    language === "en"
                      ? "Enter your username"
                      : t("Home.Username")
                  }
                /> */}

                <FormInput
                  label={language === "en" ? "Username" : t("Home.Username")}
                  name="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameInputTouched(true);
                    handleCheckUserName();
                  }}
                  placeholder={
                    language === "en"
                      ? "Enter your username"
                      : t("Home.Username")
                  }
                  msgExist={msgExist}
                  usernameInputTouched={usernameInputTouched}
                />
              </div>
              <div className="w-80 ">
                <FormInput
                  label={language === "en" ? "Name" : t("Home.Name")}
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    language === "en" ? "Enter your name" : t("Home.Name")
                  }
                />
              </div>
            </div>
            <div className="right-1 gap-4 flex">
              <div className="w-80 ">
                <FormInput
                  label="Street"
                  name="Street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street"
                />
              </div>
              <div className="w-80 ">
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
              </div>
            </div>

            {selectedGovernorate && cities && cities.length > 0 && (
              <div className="w-80 ">
                <FormSelect
                  className="w-80 "
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
              </div>
            )}
            <div className="relative right-1 flex gap-4">
              <div>
                <label
                  htmlFor="password"
                  className={`block text-xl font-medium  py-1 px-1 secondaryF ${
                    language === "ar" ? "rtl" : "ltr"
                  }`}
                >
                  {language === "en" ? "Password" : t("Home.Password")}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  className={` ${
                    language === "ar" ? "rtl" : "ltr"
                  } relative  w-80 secondary secondaryF border border-gray-300 text-xl rounded-md block  p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none focus:border-orange-400 dark:focus:border-orange-400 duration-100 ease-linear ${
                    passwordError ? "border-red-500" : "border-gray-200"
                  } placeholder:tracking-wide `}
                  placeholder={
                    language === "en"
                      ? "Enter your password"
                      : t("Home.Password")
                  }
                />
                <div
                  className={`absolute bottom-2 text-gray-700 px-3 -translate-y-1/2 cursor-pointer ${
                    language === "en" ? "left-64" : "right-64"
                  }`}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <Eye size={25} weight="bold" />
                  ) : (
                    <EyeClosed size={25} weight="bold" />
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className={`block text-xl font-medium   py-1 px-1 secondaryF ${
                    language === "ar" ? "rtl" : "ltr"
                  }`}
                >
                  {language === "en"
                    ? "Confirm Password"
                    : t("Home.ConfirmPassword")}
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  name="confirmPassword"
                  className={` ${
                    language === "ar" ? "rtl" : "ltr"
                  } relative w-80 secondary secondaryF border border-gray-300 text-xl rounded-md block p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none focus:border-orange-400 dark:focus:border-orange-400 duration-100 ease-linear${
                    passwordError ? "border-red-500" : "border-gray-200"
                  } placeholder:tracking-wide `}
                  placeholder={
                    language === "en"
                      ? "Confirm your password"
                      : t("Home.ConfirmPassword")
                  }
                />
                <div
                  className={`absolute bottom-2 text-gray-700 px-3 -translate-y-1/2 cursor-pointer ${
                    language === "en" ? "right-3" : "left-3"
                  }`}
                  onClick={toggleShowConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <Eye size={25} weight="bold" />
                  ) : (
                    <EyeClosed size={25} weight="bold" />
                  )}
                </div>
              </div>
            </div>
            <div className="right-1 flex">
              <div className="w-80 ">
                <FormInput
                  label={language === "en" ? "Email" : t("Home.Email")}
                  type="text"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    language === "en" ? "Enter your email" : t("Home.Email")
                  }
                />
              </div>
              <div className="w-80 ">
                <FormInput
                  label={language === "en" ? "Phone" : t("Home.Phone")}
                  type="text"
                  name="phone"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={
                    language === "en" ? "Enter your phone" : t("Home.Phone")
                  }
                />
              </div>
            </div>
            <button
              type="submit"
              className={`${
                language === "ar" ? "rtl" : "ltr"
              } w-80 secondaryBtn border-2 font-semibold rounded-md  ease-linear duration-150 hover:bg-gray-900  py-2 tracking-wide mt-5`}
              // className={`${language === 'ar' ? 'rtl' : 'ltr'} w-80 bg-yellow-900 text-white border-2 outline-yellow-900 font-semibold rounded-md  ease-linear duration-150 hover:bg-gray-900 rounded-md py-2 tracking-wide mt-5`}
            >
              {t("Home.Signup")}
            </button>
          </div>
          <Link to="/">{t("Home.AlreadyHaveAccount")}</Link>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
