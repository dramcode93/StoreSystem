import React, { useState } from 'react';
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const PhoneField = ({ label, value, handleDelPhone, handleAddPhone }) => {
    const [newPhone, setNewPhone] = useState(''); // State to store the new phone number

    const handleChange = (e) => {
        setNewPhone(e.target.value); // Update the new phone number state
    };

    const handleAddButtonClick = () => {
        handleAddPhone(newPhone); // Call handleAddPhone function with the new phone number
        setNewPhone(''); // Reset the new phone number state after adding
    };

    return (
        <li className='bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3'>
            <p className='text-gray-200 font-bold text-xl'>
                {label} :  <>
                    {value.map((phone, index) => (
                        <div key={index} className='text-white flex w-1/5'>
                            <p className='text-white'>
                                {phone}
                            </p>
                            <MdDelete className='text-2xl mb-3' onClick={() => handleDelPhone(index)} />
                        </div>
                    ))}
                    <div className="flex items-center mt-2">
                        <input
                            type="text"
                            className="bg-gray-600 text-gray-200 rounded-md py-1 px-2 mr-2"
                            value={newPhone}
                            onChange={handleChange}
                        />
                        <button onClick={handleAddButtonClick} className="text-gray-200 hover:text-gray-300">
                            <IoMdAdd className="text-2xl" />
                        </button>
                    </div>
                </>
            </p>
        </li>
    );
}

export default PhoneField;
