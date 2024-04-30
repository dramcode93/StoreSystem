import React from 'react';
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import Loading from '../Loading/Loading';

const PhoneField = ({ label, value, handleDelPhone, handleAddPhone, handleInputChange, handleAddToggle, isEditing, isLoading }) => {
    return (
        <li className='bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3'>
            <div className='text-gray-200 font-bold text-xl'>
                {label} :
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        {value.map((phone, index) => (
                            <div key={index} className='text-white flex w-1/5'>
                                <p className='text-white'>
                                    {phone}
                                </p>
                                <MdDelete className='text-2xl mb-3' onClick={() => handleDelPhone(index)} />
                            </div>
                        ))}
                        {isEditing ? (
                            <div>
                                <input
                                    name={label.toLowerCase()}
                                    className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
                                    onChange={handleInputChange}
                                />
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
}

export default PhoneField;
