import React from 'react';
import { FiEdit } from 'react-icons/fi';

const ProfileField = ({ label, value, isEditing, inputValue, handleInputChange, handleEditToggle }) => (
    <li className="secondary mx-10 rounded-md py-4 px-4 mb-3 list-none">
      <p className="secondaryF font-bold text-xl mb-0">
            {label} : {isEditing ? (
                <input
                    name={label.toLowerCase()}
                    value={inputValue}
                    className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
                    onChange={handleInputChange}
                />
            ) : (
                <>
                    {value}
                    <FiEdit className={`${label === "Username" ? "hidden" : "block"}`} onClick={() => handleEditToggle(label.toLowerCase())} />
                </>
            )}
        </p>
    </li>
);

export default ProfileField;
