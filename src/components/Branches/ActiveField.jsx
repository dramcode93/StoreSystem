import React, { useEffect, useState } from "react";
import { FiEdit, FiX } from "react-icons/fi";
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
    ]);
    setActiveOptions([
      { value: true, label: "Active" },
      { value: false, label: "Inactive" },
    ]);
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
    <li className="secondary mx-10 rounded-md py-4 px-4 mb-3 list-none">
      <p className="secondaryF font-bold text-xl mb-0">
        <p className="secondaryF flex">
        <diV className='d-flex'>
        {label} :
          {!isEditing && (
            <span style={{ color: value ? "green" : "red" }} className="mx-2">
              {label === "Delivery Service"
                ? value
                  ? "True"
                  : "False"
                : value
                ? "Active"
                : "Inactive"}
            </span>
          )}
        </diV>
          {isEditing ? (
            <FiX
              className="cursor-pointer text-2xl text-red-500"
              onClick={() => handleEditToggle(label.toLowerCase())}
            />
          ) : null}
        </p>
        {isEditing ? (
          <>
            <div className="flex items-center">
              <FormSelect
                headOption={`Select ${label}`}
                handleChange={handleInputChange}
                options={
                  label === "Delivery Service" ? DeliveryOptions : ActiveOptions
                }
                name={label.toLowerCase()}
                value={inputValue}
              />
              <div className="mr-10">
                <button
                  onClick={handleSaveChanges}
                  className="bg-yellow-900 rounded-full px-4 py-1 text-white hover:bg-yellow-800 font-bold "
                >
                  Save Changes
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <FiEdit
              className="cursor-pointer mt-3"
              onClick={() => handleEditToggle(label.toLowerCase())}
            />
          </>
        )}
      </p>
    </li>
  );
};

export default ActiveField;
