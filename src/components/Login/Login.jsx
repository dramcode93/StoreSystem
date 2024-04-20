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
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 border-2  rounded-xl shadow-md  min-w-full" dir="rtl">
        <div className="flex flex-col gap-2 p-3 items-center w-full text-white">
          <h1 className="font-medium text-base">{usernameError || passwordError}</h1>
          <h1 className="font-semibold text-2xl">سجل دخول</h1>
          <p className="text-center font-medium text-base">
            الوصول إلى لوحة المعلومات باستخدام اسم المستخدم وكلمة المرور
          </p>
        </div>
        <form onSubmit={handleLogin} className="p-8">
          <div className="space-y-8">
            <div className="relative">
              <label htmlFor="username" className="block font-semibold absolute -top-7 right-0 py-0 px-1 text-white">
                اسم المستخدم
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                name="username"
                className={`w-full px-3 py-3 border-2 text-white bg-gray-900 rounded-md focus:border-orange-400 outline-none ${usernameError ? "border-red-500" : "border-gray-200"} placeholder:tracking-wide text-left mb-2`}
                placeholder="Ahmed mohamed "
              />
              {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block font-semibold absolute -top-7 right-0 py-0 px-1 text-white">
                كلمة المرور
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                name="password"
                className={`w-full px-3 py-3 border-2 text-white bg-gray-900 rounded-md focus:border-orange-400 outline-none ${passwordError ? "border-red-500" : "border-gray-200"} placeholder:tracking-wide text-left`}
                placeholder="***********"
              />
              <div className="absolute top-full left-1 mt-2 mx-5 cursor-pointer text-sm font-bold text-gray-500 hover:text-gray-800" onClick={toggleShowPassword}>
                نسيت كلمة السر
              </div>
              <div className="absolute top-1/2 right-2 text-gray-700 -translate-x-1/2 -translate-y-1/2 cursor-pointer" onClick={toggleShowPassword}>
                {showPassword ? <Eye size={25} weight="bold" /> : <EyeClosed size={25} weight="bold" />}
              </div>
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-900 text-white border-2 border-yellow-400 font-semibold rounded-md py-2 tracking-wide mt-5 ease-linear duration-150 hover:bg-transparent hover:text-themeColor border-2 border-themeColor text-gray-900 rounded-md py-2 tracking-wide mt-5"
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

 