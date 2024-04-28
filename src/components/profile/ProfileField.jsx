import React from 'react';
import { FiEdit } from 'react-icons/fi';

const ProfileField = ({ label, value, isEditing, inputValue, handleInputChange, handleEditToggle }) => (
    <li className='bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3'>
        <p className='text-gray-200 font-bold text-xl'>
            {label} : {isEditing ? (
                value.map((phoneNumber, index) => (
                    <div key={index}>
                        <input
                            name={`${label.toLowerCase()}_${index}`} // Use a unique name for each input
                            value={inputValue[index]} // Use the corresponding value from the inputValue array
                            className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
                            onChange={(e) => handleInputChange(index, e.target.value)} // Pass the index and value to handleInputChange
                        />
                    </div>
                ))
            ) : (
                <>
                    {Array.isArray(value) ? (
                        value.map((phoneNumber, index) => (
                            <div key={index}>
                                <p className='text-white'>{phoneNumber}</p>
                                <FiEdit className={`${label === "Username" ? "hidden" : "block"}`} onClick={() => handleEditToggle(label.toLowerCase())} />
                            </div>
                        ))
                    ) : (
                        <>
                            {value}
                            <FiEdit className={`${label === "Username" ? "hidden" : "block"}`} onClick={() => handleEditToggle(label.toLowerCase())} />
                        </>
                    )}
                </>
            )}
        </p>
    </li>
);

export default ProfileField;
