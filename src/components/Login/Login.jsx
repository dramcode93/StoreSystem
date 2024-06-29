import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Eye, EyeClosed } from '@phosphor-icons/react';
import { useI18nContext } from '../context/i18n-context';
import { Link } from 'react-router-dom';

const Login = () => {
  const { language } = useI18nContext();
  const { t } = useI18nContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (username.trim() === "") {
      setUsernameError("Username is required");
      return;
    } else {
      setUsernameError("");
    }

    if (password.trim() === "") {
      setPasswordError("Password is required");
      return;
    } else {
      setPasswordError("");
    }

    try {
      const response = await axios.post('https://store-system-api.gleeze.com/api/auth/login', {
        username,
        password,
      });
      const token = response.data.token;
      const tokenTime = 2;
      Cookies.set('token', token, { expires: tokenTime, secure: true, sameSite: 'strict' });
      window.location.href = '/home';
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="secondary border-2 parentDiv shadow-md w-96" dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="flex flex-col gap-2 p-3 items-center w-full text-white">
          <h1 className="font-medium text-base">{usernameError || passwordError}</h1>
          <h1 className="font-semibold text-center pdarkForm plightForm text-2xl secondaryF">
            {t("Home.Login")}
          </h1>

        </div>
        <form onSubmit={handleLogin} className="p-8 darkForm lightForm relative">
          <div className="space-y-8">
            <div className=" right-1">
              <label htmlFor="username" className={`block font-semibold absolute top-0  py-0 px-1 secondaryF ${language === 'ar' ? 'rtl' : 'ltr'}`}>
                {language === 'en' ? 'Username' : t("Home.Username")}
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                name="username"
                className={`w-80 darkForm lightForm px-3 py-3 border-2 bg-gray-900 rounded-md focus:border-blue-400 outline-none ${usernameError ? "border-red-500" : "border-gray-200"} placeholder:tracking-wide  mb-2 `}
                placeholder={language === 'en' ? 'Enter your username' : t("Home.Username")}
              />
              
              {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
            </div>

            <div className="relative right-1 ">
              <label htmlFor="password" className={`block font-semibold absolute -top-8 py-1 px-1 secondaryF  ${language === 'ar' ? 'rtl' : 'ltr'}`}>
                {language === 'en' ? 'Password' : t("Home.Password")}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                name="password"
                className={` ${language === 'ar' ? 'rtl' : 'ltr'} relative w-80 darkForm lightForm px-3 py-3 border-2 text-white bg-gray-900 rounded-md focus:border-blue-400 outline-none ${passwordError ? "border-red-500" : "border-gray-200"} placeholder:tracking-wide `}
                placeholder={language === 'en' ? 'Enter your password' : t("Home.Password")}
              />

              <div  className={`${language === 'ar' ? 'rtl' : 'ltr'} absolute top-full my-2 tracking-wide mx-0  cursor-pointer text-lg font-bold text-gray-500 hover:text-gray-800`}>
               <Link to='/forgotPassword1'>
               {t("Home.ForgetPass")}
               </Link>
              </div>
              <div className={`absolute top-1/2 text-gray-700 px-3 -translate-y-1/2 cursor-pointer ${language === 'en' ? 'left-64' : 'right-64'}`} onClick={toggleShowPassword}>
                {showPassword ? <Eye size={25} weight="bold" /> : <EyeClosed size={25} weight="bold" />}
              </div>
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>

            <button
              type="submit"
              className={`${language === 'ar' ? 'rtl' : 'ltr'} secondaryBtn w-80  border-2  font-semibold ease-linear duration-150 rounded-md py-2 tracking-wide mt-5`}
              // className={`${language === 'ar' ? 'rtl' : 'ltr'} w-80 bg-yellow-900 text-white border-2 outline-yellow-900 font-semibold rounded-md  ease-linear duration-150 hover:bg-gray-900 rounded-md py-2 tracking-wide mt-5`}
            >
              {t("Home.Login")}
            </button>

          </div>
          <Link to='/signup'>I don't have an account. Sign Up?</Link>

        </form>
      </div>
    </div>
  );
};

export default Login;
