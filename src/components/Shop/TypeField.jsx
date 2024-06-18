import React, { useCallback, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import Loading from "../Loading/Loading";
import FormSelect from "../../form/FormSelect"; 
import { IoMdAdd } from "react-icons/io";
import { FaRegSave } from "react-icons/fa"; 
import axios from "axios";
import Cookies from "js-cookie";

const TypeField = ({
  label,
  value,
  handleDelType, 
  handleAddType,
  handleInputChange, 
  handleAddToggle, 
  isEditing, 
  isLoading, 
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
            setTypes(typesList.data.data)
          } else {
            console.error("No token found.");
          }
        } catch (error) {
          console.error("Error fetching types data:", error);
        } finally {
        }
      }, [token]);
      
      useEffect(() => {
        fetchData();
      }, [fetchData]);
  return (
    <li className="bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3 list-none">
      <div className="text-gray-200 font-bold text-xl">
        {label} :
        {isLoading ? (
          <Loading /> 
        ) : (
          <>
            {value.map((type, index) => (
              <div key={index} className="text-white flex w-1/2">
                <p className="text-white">{type.type_en}</p>
                <MdDelete
                  className="text-2xl mb-3"
                  onClick={() => handleDelType(type._id)} 
                />
              </div>
            ))}
            {isEditing ? (
              <div>
                <FormSelect
                  headOption="Select Type" 
                  handleChange={handleInputChange}
                  options={types.map((type) => ({
                    value: type._id, 
                    label: type.type_en, 
                  }))}
                  name="Type" 
                />
                <FaRegSave onClick={handleAddType} className="text-2xl mt-2" />
              </div>
            ) : (
              <IoMdAdd onClick={handleAddToggle} className="text-2xl" />
            )}
          </>
        )}
      </div>
    </li>
  );
};

export default TypeField;
