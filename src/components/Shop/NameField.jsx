import React from "react";
import { FiEdit } from "react-icons/fi";
import FormText from "../../form/FormText";

const NameField = ({
  label,
  value,
  isEditing,
  inputValue,
  handleInputChange,
  handleEditToggle,
  handleSaveChanges,
}) => (
  <li className="bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3 list-none">
    <p className="text-gray-200 font-bold text-xl">
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
            className="bg-yellow-900  rounded-full hover:bg-yellow-800 fw-bold"
          >
            Save Changes
          </button>
         </div>
        </div>
      ) : (
        <>
          {value}
          <FiEdit
            className={`${label === "Username" ? "hidden" : "block"}`}
            onClick={() => handleEditToggle(label.toLowerCase())}
          />
        </>
      )}
    </p>
    {/* <div className="mx-10">
      {isEditing && (
        <button
          onClick={handleSaveChanges}
          className="bg-yellow-900  rounded-full hover:bg-yellow-800 fw-bold"
        >
          Save Changes
        </button>
      )}
    </div> */}
  </li>
);

export default NameField;
