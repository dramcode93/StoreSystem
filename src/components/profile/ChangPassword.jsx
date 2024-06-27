import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useI18nContext } from "../context/i18n-context";
import FormInput from "../../form/FormInput";

const API_password =
  "https://store-system-api.gleeze.com/api/users/updateMyPassword";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { language, t } = useI18nContext();
  let token = Cookies.get("token");

  const handleEditPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_password}`,
        {
          currentPassword,
          password,
          confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error(
        "An error occurred while sending the reset password request",
        error
      );
      setError(
        "Password change failed. Please check your inputs and try again."
      );
    }
    window.location.href = "/information";
  };

  return (
    <div
      className={` mx-10 rounded-md pt-2 absolute top-32 -z-50 w-3/4 ${language === "ar" ? "left-10" : "right-10"}`}
    >
      {/* <h3 className="font-bold text-white">
        {t(`ChangePasswordPage.ChangePasswordPage`)}
      </h3> */}
      <form className="p-9">
        <FormInput
          label={t(`ChangePasswordPage.CurrentPassword`)}
          name="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="current Password"
          type="password"
        />
        <FormInput
          label={t(`ChangePasswordPage.NewPassword`)}
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <FormInput
          label={t(`ChangePasswordPage.ConfirmNewPassword`)}
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="confirm Password"
          type="password"
        />
        {/* <label htmlFor="password">
          {t(`ChangePasswordPage.CurrentPassword`)}
        </label>
        <input
          id="password"
          className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
          type="password"
          name="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        /> */}

        {/* <label htmlFor="newPassword">
          {t(`ChangePasswordPage.NewPassword`)}
        </label>
        <input
          id="newPassword"
          className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /> */}

        {/* <label htmlFor="confirmPassword">
          {t(`ChangePasswordPage.ConfirmNewPassword`)}
        </label>
        <input
          type="password"
          className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        /> */}

        <button
          onClick={handleEditPassword}
          className="secondaryBtn  h-12 rounded-md  fw-bold text-xl rounded-lg"
        >
          {t(`ChangePasswordPage.ChangePassword`)}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ChangePassword;
