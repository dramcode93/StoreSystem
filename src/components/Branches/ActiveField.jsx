import React from "react";
import { FiEdit } from "react-icons/fi";
import FormSelect from "../../form/FormSelect";

const ActiveField = ({
  label,
  value,
  isEditing,
  inputValue,
  handleInputChange,
  handleEditToggle,
  handleSaveChanges,
  options,
}) => (
  <li className="bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3 list-none">
    <p className="text-gray-200 font-bold text-xl">
      {label} :{" "}
      {isEditing ? (
        <div className="flex items-center">
          <FormSelect
            headOption={`Select ${label} state`}
            handleChange={handleInputChange}
            options={options.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            name={label.toLowerCase()}
          />
          <div className="mx-10">
            <button
              onClick={handleSaveChanges}
              className="bg-yellow-900 rounded-full hover:bg-yellow-800 fw-bold"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <>
          {label === "Delivery Service" ? (
            <span style={{ color: value ? "green" : "red" }}>
              {value ? "True" : "False"}
            </span>
          ) : (
            <span style={{ color: value ? "green" : "red" }}>
              {value ? "Active" : "Inactive"}
            </span>
          )}
          <FiEdit
            className="cursor-pointer"
            onClick={() => handleEditToggle(label.toLowerCase())}
          />
        </>
      )}
    </p>
  </li>
);

export default ActiveField;
