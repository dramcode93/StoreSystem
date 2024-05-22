import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import FormInput from "../../form/FormInput";

const ChangeUserPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const API_password1 = `https://store-system-api.gleeze.com/api/Users/${id}/changeUserPassword`;

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setError("Authentication token is missing. Please login again.");
    }
  }, []);

  const handleEditPassword = async (e) => {
    e.preventDefault();

    try {
      const token = Cookies.get("token");
      console.log("Token:", token);
      console.log("ID:", id);

      const response = await axios.put(
        API_password1,
        {
          password,
          passwordConfirmation,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = "/users";
    } catch (error) {
      console.error(
        "An error occurred while sending the reset password request",
        error
      );
      setError(
        "Password change failed. Please check your inputs and try again."
      );
    }
  };

  return (
    <div className="bg-gray-700 bg-opacity-25 mx-10 rounded-md py-4 px-4 text-gray-200 absolute top-40 w-3/4">
      <h3 className="font-bold text-white">Change Password Page :</h3>
      <form className="px-2">
        <FormInput
          label="New Password :"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="confirm Password"
          type="password"
        />
        <FormInput
          label="Confirm New Password :"
          name="passwordConfirmation"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          placeholder="confirm Password"
          type="password"
        />
        {/* <label htmlFor="newPassword">New Password :</label>
        <input
          id="newPassword"
          type="password"
          name="password"
          className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="confirmPassword">Confirm New Password :</label>
        <input
          type="password"
          id="confirmPassword"
          name="passwordConfirmation"
          className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        /> */}
        <button
          onClick={handleEditPassword}
          className="bg-yellow-900  rounded-lg hover:bg-yellow-800 fw-bold"
        >
          Change Password
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ChangeUserPassword;
