import React, { useCallback, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import Loading from "../Loading/Loading";
import FormSelect from "../../form/FormSelect";
import { IoMdAdd } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { FiX } from "react-icons/fi";

const TypeField = ({
  label,
  value,
  handleDelType,
  handleAddType,
  handleInputChange,
  handleAddToggle,
  isEditing,
  isLoading,
  inputValue
}) => {
  const token = Cookies.get("token");
  const [types, setTypes] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const typesList = await axios.get(
          "https://store-system-api.gleeze.com/api/shopTypes",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTypes(typesList.data.data);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error fetching types data:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Convert types to an array
  useEffect(() => {
    if (typeof types === "string" && types.trim() !== "") {
      try {
        const parsedTypes = JSON.parse(types);
        setTypes(parsedTypes);
      } catch (error) {
        console.error("Error parsing types JSON:", error);
      }
    }
  }, [types]);

  const options = types.map((type) => ({
    value: type._id,
    label: type.type_en,
  }));

  return (
    <li className="secondary mx-10 rounded-md py-4 px-4 mb-3 list-none">
      <div className="secondaryF font-bold text-xl mb-0">
      <p className="secondaryF flex">
        {label} :
        {isEditing ? (
          <FiX
            className="cursor-pointer text-2xl text-red-500"
            onClick={() => handleAddToggle(label.toLowerCase())}
          />
        ) : (
          ""
        )}
      </p>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {value && Array.isArray(value) && value.length > 0 ? (
              value.map((type, index) => (
                <div key={index} className=" flex w-1/2">
                  <p className="secondaryF">{type.type_en}</p>
                  <MdDelete
                    className="text-2xl mb-3 "
                    onClick={() => handleDelType(type._id)}
                    color="red"
                  />
                </div>
              ))
            ) : (
              <p className="text-white"></p>
            )}
            {isEditing ? (
              <div>
                <FormSelect
                  headOption="Select Type"
                  handleChange={handleInputChange}
                  options={options}
                  name="Type"
                  value={inputValue}
                />
                <FaRegSave onClick={handleAddType} className="text-2xl mt-3 secondaryF " />
              </div>
            ) : (
              <IoMdAdd onClick={handleAddToggle} className="text-2xl secondaryF" />
            )}
          </>
        )}
      </div>
    </li>
  );
};

export default TypeField;
