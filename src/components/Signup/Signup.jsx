import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Eye, EyeClosed } from '@phosphor-icons/react';
import { useI18nContext } from '../context/i18n-context';
import { Link } from 'react-router-dom';
import FormSelect from '../../form/FormSelect';
import FormInput from '../../form/FormInput';

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
            const response = await axios.post('https://store-system-api.gleeze.com/api/auth/signup', {
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
            }, { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    window.location.href = '/';
                });
            closeModal();
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };


    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="min-h-screen flex">
            <div className="bg-gray-900 w-2/3 dark:bg-gray-100 border-2 parentDiv rounded-xl shadow-md " dir={language === "ar" ? "rtl" : "ltr"}>
                <div className="flex flex-col gap-1 p-3 items-center  text-white">
                    <h1 className="font-medium text-base">{usernameError || passwordError}</h1>
                    <h1 className="font-semibold text-center pdarkForm plightForm text-2xl">
                        {t("Home.Signup")}
                    </h1>
                </div>
                <form onSubmit={handleSignUp} className="p-8 darkForm lightForm relative">
                    <div className="space-y-8">
                        <div className="right-1 gap-1 flex">
                            <div>
                                <label htmlFor="username" className={`block font-semibold   py-0 px-1 text-white ${language === 'ar' ? 'rtl' : 'ltr'}`}>
                                    {language === 'en' ? 'Username' : t("Home.Username")}
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    name="username"
                                    className={`w-80 darkForm lightForm px-3 py-3 border-2 text-white bg-gray-900 rounded-md focus:border-orange-400 outline-none ${usernameError ? "border-red-500" : "border-gray-200"} placeholder:tracking-wide  mb-2 `}
                                    placeholder={language === 'en' ? 'Enter your username' : t("Home.Username")}
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className={`block font-semibold py-0 px-1 text-white ${language === 'ar' ? 'rtl' : 'ltr'}`}>
                                    {language === 'en' ? 'Name' : t("Home.Name")}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    name="name"
                                    className={`w-80 darkForm lightForm px-3 py-3 border-2 text-white bg-gray-900 rounded-md focus:border-orange-400 outline-none ${usernameError ? "border-red-500" : "border-gray-200"} placeholder:tracking-wide  mb-2 `}
                                    placeholder={language === 'en' ? 'Enter your name' : t("Home.Name")}
                                />
                            </div>
                        </div>
                        <div className='flex gap-1 w-full'>
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
                            {selectedGovernorate && cities && cities.length > 0 && (
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
                            )}

                        </div>
                        <div className="relative right-1 flex">
                            <div>
                                <label htmlFor="password" className={`block font-semibold  py-1 px-1 text-white ${language === 'ar' ? 'rtl' : 'ltr'}`}>
                                    {language === 'en' ? 'Password' : t("Home.Password")}
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    name="password"
                                    className={` ${language === 'ar' ? 'rtl' : 'ltr'} relative w-80 darkForm lightForm px-3 py-3 border-2 text-white bg-gray-900 rounded-md focus:border-orange-400 outline-none ${passwordError ? "border-red-500" : "border-gray-200"} placeholder:tracking-wide `}
                                    placeholder={language === 'en' ? 'Enter your password' : t("Home.Password")}
                                />
                                <div className={`absolute bottom-2 text-gray-700 px-3 -translate-y-1/2 cursor-pointer ${language === 'en' ? 'left-64' : 'right-64'}`} onClick={toggleShowPassword}>
                                    {showPassword ? <Eye size={25} weight="bold" /> : <EyeClosed size={25} weight="bold" />}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className={`block font-semibold  py-1 px-1 text-white ${language === 'ar' ? 'rtl' : 'ltr'}`}>
                                    {language === 'en' ? 'Confirm Password' : t("Home.ConfirmPassword")}
                                </label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    name="confirmPassword"
                                    className={` ${language === 'ar' ? 'rtl' : 'ltr'} relative w-80 darkForm lightForm px-3 py-3 border-2 text-white bg-gray-900 rounded-md focus:border-orange-400 outline-none ${passwordError ? "border-red-500" : "border-gray-200"} placeholder:tracking-wide `}
                                    placeholder={language === 'en' ? 'Confirm your password' : t("Home.ConfirmPassword")}
                                />
                                <div className={`absolute bottom-2 text-gray-700 px-3 -translate-y-1/2 cursor-pointer ${language === 'en' ? 'right-3' : 'left-3'}`} onClick={toggleShowConfirmPassword}>
                                    {showConfirmPassword ? <Eye size={25} weight="bold" /> : <EyeClosed size={25} weight="bold" />}
                                </div>
                            </div>
                        </div>
                        <div className="right-1 flex">
                            <div>
                                <label htmlFor="email" className={`block font-semibold py-1 px-1 text-white ${language === 'ar' ? 'rtl' : 'ltr'}`}>
                                    {language === 'en' ? 'Email' : t("Home.Email")}
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    name="email"
                                    className={`w-80 darkForm lightForm px-3 py-3 border-2 text-white bg-gray-900 rounded-md focus:border-orange-400 outline-none ${usernameError ? "border-red-500" : "border-gray-200"} placeholder:tracking-wide  mb-2 `}
                                    placeholder={language === 'en' ? 'Enter your email' : t("Home.Email")}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className={`block font-semibold py-1 px-1 text-white ${language === 'ar' ? 'rtl' : 'ltr'}`}>
                                    {language === 'en' ? 'Phone' : t("Home.Phone")}
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    name="phone"
                                    className={`w-80 darkForm lightForm px-3 py-3 border-2 text-white bg-gray-900 rounded-md focus:border-orange-400 outline-none ${usernameError ? "border-red-500" : "border-gray-200"} placeholder:tracking-wide  mb-2 `}
                                    placeholder={language === 'en' ? 'Enter your phone' : t("Home.Phone")}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={`${language === 'ar' ? 'rtl' : 'ltr'} w-80 bg-yellow-900 text-white border-2 outline-yellow-900 font-semibold rounded-md  ease-linear duration-150 hover:bg-gray-900 rounded-md py-2 tracking-wide mt-5`}
                        >
                            {t("Home.Signup")}
                        </button>
                    </div>
                    <Link to='/'>{t("Home.AlreadyHaveAccount")}</Link>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
