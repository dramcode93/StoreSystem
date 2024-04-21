import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Eye, EyeClosed } from '@phosphor-icons/react';

const Login = () => {
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
      const tokenTime = 2
      Cookies.set('token', token, { expires: tokenTime, secure: true, sameSite: 'strict' })
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
    <div className="mt-5 flex items-center justify-center">
      <div className="bg-gray-900 dark:bg-gray-100 border-2 mt-5 parentDiv min-w-80  rounded-xl shadow-md w-96" dir="rtl">
        <div className="flex flex-col  gap-2 p-3 items-center w-full text-white">
          <h1 className="font-medium text-base">{usernameError || passwordError}</h1>
          <h1 className="font-semibold text-center pdarkForm plightForm text-2xl">سجل دخول</h1>
          <p className="text-center hdarkForm hlightForm font-medium text-base">
            الوصول إلى لوحة المعلومات باستخدام اسم المستخدم وكلمة المرور
          </p>
        </div>
        <form onSubmit={handleLogin} className="p-8  darkForm lightForm">
          <div className="space-y-8">
            <div className="relative right-1">
              <label htmlFor="username" className="block font-semibold absolute -top-8 right-0 py-0 px-1 text-white">
                اسم المستخدم
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                name="username"
                className={`w-80 inputdarkForm inputlightForm px-3 py-3 border-2 text-white bg-gray-900 rounded-md focus:border-orange-400 outline-none ${usernameError ? "border-red-500" : "border-gray-200"} placeholder:tracking-wide text-left mb-2`}
                placeholder="Ahmed mohamed "
              />
              {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
            </div>

            <div className="relative right-1">
              <label htmlFor="password" className="block font-semibold absolute -top-8 right-0 py-1 px-1 text-white">
                كلمة المرور
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                name="password"
                className={`w-80 darkForm lightForm px-3 py-3 border-2 text-white bg-gray-900 rounded-md focus:border-orange-400 outline-none ${passwordError ? "border-red-500" : "border-gray-200"} placeholder:tracking-wide text-left`}
                placeholder="***********"
              />
              <div className="absolute top-full right-0 my-3 tracking-wide mx-0  cursor-pointer text-xl font-bold text-gray-500 hover:text-gray-800" onClick={toggleShowPassword}>
                 نسيت كلمة السر ؟
              </div>
              <div className="absolute top-1/2 right-2 text-gray-700 -translate-x-1/2 -translate-y-1/2 cursor-pointer" onClick={toggleShowPassword}>
                {showPassword ? <Eye size={25} weight="bold" /> : <EyeClosed size={25} weight="bold" />}
              </div>
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>

            <button
              type="submit"
              className="w-80 bg-yellow-900 text-white border-2 outline-yellow-900 font-semibold rounded-md  ease-linear duration-150 hover:bg-gray-900 rounded-md py-2 tracking-wide mt-5"
            >
              تسجيل الدخول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;