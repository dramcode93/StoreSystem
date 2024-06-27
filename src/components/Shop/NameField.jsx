import React from "react";
import { FiEdit, FiX } from "react-icons/fi";
import FormText from "../../form/FormText";
import Loading from "../Loading/Loading";

const NameField = ({
  label,
  value,
  isEditing,
  inputValue,
  handleInputChange,
  handleEditToggle,
  handleSaveChanges,
  isLoading,
}) => (
  <li className="secondary mx-10 rounded-md py-4 px-4 mb-3 list-none">
    <p className="secondaryF font-bold text-xl mb-0">
    <div className={`d-flex items-center ${isEditing ? "justify-between" : ""}`}>
        <p className="secondaryF font-bold text-xl mb-0 ">{label} : </p>
        {isEditing && (
          <span>
            <FiX
              className="cursor-pointer text-2xl text-red-500"
              onClick={() => handleEditToggle(label.toLowerCase())}
            />
          </span>
        )}
        {!isEditing && (
          <span className="mx-2 inline-block secondaryF">{value}</span>
        )}
      </div>
      {isLoading ? (
        <Loading />
      ) : isEditing ? (
        <div className="flex">
          <FormText
            name={label.toLowerCase()}
            value={inputValue}
            onChange={handleInputChange}
          />
          <div className="mx-10">
            <button
              onClick={handleSaveChanges}
              className="bg-yellow-900  px-4 py-1 rounded-full hover:bg-yellow-800 fw-bold"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* <p className="secondaryF inline-block">{value}</p> */}
          <FiEdit
            className={`${label === "Username" ? "hidden" : "block"} mt-3 `}
            onClick={() => handleEditToggle(label.toLowerCase())}
          />
        </>
      )}
    </p>
  </li>
);

export default NameField;
