import React from 'react';
import { FiEdit } from 'react-icons/fi';

const AddressField = ({ label, value, isEditing, inputValue, handleInputChange, handleEditToggle }) => {

    const handlePrintAddress = () => {
        console.log(`${value}`);
    };

    return (
        <li className='bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3'>
            <p className='text-gray-200 font-bold text-xl'>
                {label} : {isEditing ? (
                    <input
                        name={label.toLowerCase()}
                        value={inputValue}
                        className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
                        onChange={handleInputChange}
                    />
                ) : (
                    <>
                        {value.governorate}, {value.city}, {value.street}
                        <FiEdit onClick={() => handleEditToggle(label.toLowerCase())} />
                    </>
                )}
            </p>
            {!isEditing && (
                <button onClick={handlePrintAddress} className="text-blue-500 hover:text-blue-700">
                    Print Address
                </button>
            )}
        </li>
    );
};

export default AddressField;
