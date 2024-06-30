import React from "react";
import { FiEdit } from "react-icons/fi";
import FormText from "../../form/FormText";

const ProfileField = ({
  label,
  value,
  isEditing,
  inputValue,
  handleInputChange,
  handleEditToggle,
  handleSaveChanges,
  name,
  role,
}) => (
  <li className="secondary mx-10 rounded-md py-4 px-4 mb-3 list-none">
    <p className="secondaryF font-bold text-xl mb-0">
      {label} :{" "}
      {isEditing ? (
  
        <div className="flex">
        
         <FormText
            name={label.toLowerCase()}
            value={inputValue}
            onChange={handleInputChange}
          />
        <div className="mx-10">
            <button
              onClick={handleSaveChanges}
              className="secondaryBtn px-4 py-1 fw-bold"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <>
          {value}
          {role === "user" ? (
            ""
          ) : (
            <FiEdit
              className={`${name === "userName" ? "hidden" : "block"}`}
              onClick={() => handleEditToggle(label.toLowerCase())}
            />
          )}
        </>
      )}
    </p>
  </li>
);

export default ProfileField;
