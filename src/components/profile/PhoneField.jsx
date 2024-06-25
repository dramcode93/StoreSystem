import React from "react";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import Loading from "../Loading/Loading";
import FormNumber from "../../form/FormNumber";
import { FiX } from "react-icons/fi";

const PhoneField = ({
  label,
  value,
  handleDelPhone,
  handleAddPhone,
  handleInputChange,
  handleAddToggle,
  isEditing,
  isLoading,
}) => {
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
          ) : null}
        </p>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {value &&
              value.map((phone, index) => (
                <div key={index} className="secondaryF flex w-1/2">
                  <p className="secondaryF">{phone}</p>
                  <MdDelete
                    className="text-2xl mb-3"
                    color="red"
                    onClick={() => handleDelPhone(phone)}
                  />
                </div>
              ))}
            {isEditing ? (
              <div>
                {/* <input
                  name={label.toLowerCase()}
                  className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
                  onChange={handleInputChange}
                /> */}
                <div className="mr-52">
                  <FormNumber
                    placeholder={label}
                    onChange={handleInputChange}
                  />
                </div>
                <FaRegSave onClick={handleAddPhone} className="text-2xl mt-2" />
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

export default PhoneField;
