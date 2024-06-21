import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import Loading from "../Loading/Loading";
import { useI18nContext } from "../context/i18n-context";
import { FiEdit } from "react-icons/fi";

const AddressField = ({
  label,
  values,
  openEdit,
  isLoading,
}) => {
  const { language } = useI18nContext();
  return (
    <li className="bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3 list-none">
      <p className="text-gray-200 font-bold text-xl">{label} :</p>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {Array.isArray(values) && values.length > 0 ? (
            values.map((address, index) => (
              <div
                key={index}
                className="text-white flex w-1/2 justify-between text-xl"
              >
                <p className="text-gray-200">
                  {`${address.street},  
                  ${
                    language === "ar"
                      ? address.city?.city_name_ar
                      : address.city?.city_name_en
                  },  
                  ${
                    language === "ar"
                      ? address.governorate?.governorate_name_ar
                      : address.governorate?.governorate_name_en
                  }`}
                </p>
              </div>
            ))
          ) : (
            <p>No addresses available</p>
          )}
          <FiEdit
          
           className="text-white text-xl cursor-pointer"
            onClick={openEdit} />
        </>
      )}
    </li>
  );
};

export default AddressField;
