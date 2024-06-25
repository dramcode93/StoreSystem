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
    <li className="secondary mx-10 rounded-md py-4 px-4 mb-3 list-none">
      <p className="secondaryF font-bold text-xl mb-0">
      {label} :</p>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {Array.isArray(values) && values.length > 0 ? (
            values.map((address, index) => (
              <div
                key={index}
                className="secondaryF font-bold text-xl mb-0 flex w-1/2 justify-between"
              >
                <p className="secondaryF">
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
            <p className="secondaryF font-bold text-xl mb-0" >No addresses available</p>
          )}
          <FiEdit
          
           className="secondaryF text-xl cursor-pointer"
            onClick={openEdit} />
        </>
      )}
    </li>
  );
};

export default AddressField;
