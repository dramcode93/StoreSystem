import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import FormInput from "../../form/FormInput";
import { useI18nContext } from "../context/i18n-context";
import Loading from "../Loading/Loading";

const ChangeUserPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const { language, t } = useI18nContext();
  const API_password1 = `https://store-system-api.gleeze.com/api/Users/${id}/changeUserPassword`;
  const API_users = "https://store-system-api.gleeze.com/api/Users";

  const token = Cookies.get("token");
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const response = await axios.get(
          `${API_users}?sort=-role name&fields=username name email phone address active role`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(response.data.data);
        if (users.length > 0) {
          const user = users.find((user) => user._id === id);
          if (user) {
            setUserName(user.name);
          } else {
            setError("User not found");
          }
        }
        // console.log(users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      if(userName){
        setLoading(false);
      }
    }
  }, [token, users,id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    <div
      className={` mx-10 rounded-md pt-2 absolute top-32 -z-50 w-3/4 ${
        language === "ar" ? "left-10" : "right-10"
      }`}
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          {userName && (
            <h3 className="font-bold secondaryF text-center">
              Change{" "}
              <span className="font-bold text-blue-600 uppercase">{userName}</span>{" "}
              Password
            </h3>
          )}
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
            <button
              onClick={handleEditPassword}
              className="secondaryBtn h-12 fw-bold text-xl rounded-lg"
            >
              Change Password
            </button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
};


export default ChangeUserPassword;
