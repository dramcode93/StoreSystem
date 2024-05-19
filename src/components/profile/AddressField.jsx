import React from 'react';
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import Loading from '../Loading/Loading';
import { useI18nContext } from "../context/i18n-context";

const AddressField = ({ label, values, openAdd, handleDelAddress, isLoading }) => {
    const { language } = useI18nContext();

    return (
        <li className='bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3'>
            <p className='text-gray-200 font-bold text-xl'>{label} :</p>

            {isLoading ? ( 
                <Loading />
            ) : (
                <>
                    {values.map((address, index) => (
                        <div key={index} className='text-white flex w-1/2 justify-between text-xl'>
                            <p className="text-gray-200">
                                {`${address.street},  
            ${language === "ar" ? address.city?.city_name_ar : address.city?.city_name_en},  
            ${language === "ar" ? address.governorate?.governorate_name_ar : address.governorate?.governorate_name_en}`}
                            </p>
                            <MdDelete className='text-2xl mb-3' onClick={() => handleDelAddress(index)} />
                        </div>
                    ))}
                    <IoMdAdd className="text-white text-2xl" onClick={openAdd} />
                </>
            )}
        </li>
    );
}

export default AddressField;
