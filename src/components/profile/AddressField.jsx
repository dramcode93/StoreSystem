import React from "react";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import Loading from "../Loading/Loading";
import { useI18nContext } from "../context/i18n-context";

const AddressField = ({
  label,
  values,
  openAdd,
  handleDelAddress,
  isLoading,
  role,
}) => {
  const { language } = useI18nContext();
  return (
    <li className="secondary mx-10 rounded-md py-4 px-4 list-none">
      <p className="secondaryF font-bold text-xl mb-0">{label} :</p>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {Array.isArray(values) && values.length > 0 ? (
            values.map((address, index) => (
              <div key={index} className=" flex w-1/2 justify-between text-xl">
                <p className="secondaryF mb-0">
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
                {role === "user" ? (
                  ""
                ) : (
                  <MdDelete
                    className="text-2xl mb-3"
                    color="red"
                    onClick={() => handleDelAddress(index)}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="secondaryF">No addresses available</p>
          )}
          {role === "user" ?"": (<IoMdAdd className="secondaryF text-2xl" onClick={openAdd} />)}
          
        </>
      )}
    </li>
  );
};

export default AddressField;
