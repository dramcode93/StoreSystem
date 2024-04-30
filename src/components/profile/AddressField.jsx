import React from 'react';
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const AddressField = ({ label, values, isEditing, inputValue, handleInputChange, openAdd, handleEditToggle, handleDelAddress }) => (
    <li className='bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3'>
        <p className='text-gray-200 font-bold text-xl'>{label} :</p>

        {
            values.map((address, index) => (
                <div key={index} className='text-white flex w-1/5 text-xl'>
                    <p className="text-gray-200">
                        {address.governorate.governorate_name_en}, {address.city.city_name_en}, {address.street}
                    </p>
                    <MdDelete className='text-3xl mb-5' onClick={() => handleDelAddress(index)} />

                </div>
            ))
        }
        <IoMdAdd className="text-2xl" onClick={openAdd} />

    </li>
);

export default AddressField;








// import React from 'react';
// import { FiEdit } from 'react-icons/fi';

// const AddressField = ({ label, values, isEditing, inputValue, handleInputChange, handleEditToggle }) => (
//     <li className='bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3'>
//         <p className='text-gray-200 font-bold text-xl'>{label}:</p>



//         {isEditing ? (
//             values.map((address, index) => (
//                 <input
//                     key={index}
//                     name={`${label.toLowerCase()}_${index}`}
//                     value={inputValue[index]}
//                     className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
//                     onChange={e => handleInputChange(e, index)}
//                 />
//             ))
//         ) : (
//             values.map((address, index) => (
//                 <p key={index} className="text-gray-200">
//                     {address.governorate.governorate_name_en}, {address.city.city_name_en}, {address.street}
//                     <FiEdit onClick={() => handleEditToggle(label.toLowerCase())} />
//                 </p>
//             ))
//         )}
//     </li>
// );

// export default AddressField;
