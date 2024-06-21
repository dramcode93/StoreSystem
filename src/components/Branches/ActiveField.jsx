import React, { useEffect, useState } from "react";
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
}) => {
  // Define options for Delivery Service and Active State
  const [options, setOptions] = useState("");
  const [DeliveryOptions, setDeliveryOptions] = useState("");
  const [ActiveOptions, setActiveOptions] = useState("");

  // const DeliveryOptions = [
  //   { value: true, label: "True" },
  //   { value: false, label: "False" },
  // ];

  // const ActiveOptions = [
  //   { value: true, label: "Active" },
  //   { value: false, label: "Inactive" },
  // ];

  useEffect(() => {
    setDeliveryOptions([
      { value: true, label: "True" },
      { value: false, label: "False" },
    ])
    setActiveOptions([
      { value: true, label: "Active" },
      { value: false, label: "Inactive" },
    ])
    // if (label === "Delivery Service") {
    //   setOptions([
    //     { value: true, label: "True" },
    //     { value: false, label: "False" },
    //   ]);
    // } else {
    //   setOptions([
    //     { value: true, label: "Active" },
    //     { value: false, label: "Inactive" },
    //   ]);
    // }

  }, [label]);

  return (
    <li className="bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3 list-none">
      <p className="text-gray-200 font-bold text-xl">
        {label} :{" "}
        {isEditing ? (
          <div className="flex items-center">
            <FormSelect
              headOption={`Select ${label}`}
              handleChange={handleInputChange}
              options={
                label === "Delivery Service"?DeliveryOptions:ActiveOptions
              }
              name={label.toLowerCase()}
              value={inputValue}
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
            <span style={{ color: value ? "green" : "red" }}>
              {label === "Delivery Service"
                ? value
                  ? "True"
                  : "False"
                : value
                ? "Active"
                : "Inactive"}
            </span>
            <FiEdit
              className="cursor-pointer"
              onClick={() => handleEditToggle(label.toLowerCase())}
            />
          </>
        )}
      </p>
    </li>
  );
};

export default ActiveField;
