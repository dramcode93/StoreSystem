import React from "react";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import Loading from "../Loading/Loading";
import FormText from "../../form/FormText";
import { FiX } from "react-icons/fi";

const PaymentField = ({
  label,
  value,
  handleDelPaymentMethod,
  handleAddPaymentMethod,
  handleInputChange,
  handleAddToggle,
  isEditing,
  isLoading,
  newPaymentMethod,
}) => {
  return (
    <li className="secondary mx-10 rounded-md py-4 px-4 mb-3 list-none">
      <div className="secondaryF font-bold text-xl mb-0">
      <p className="secondaryF flex">
          {label} :
          {isEditing ? (
            <FiX
              className="cursor-pointer text-2xl text-red-500"
              onClick={() => handleAddToggle(label.toLowerCase())}
            />
          ) : null}
        </p>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {value && value.length > 0 ? (
              value.map((method, index) => (
                <div
                  key={index}
                  className="secondaryF flex justify-between items-center w-4/5 gap-4"
                >
                  <div className="flex gap-4 ">
                    <p className=" w-40 secondaryF">{`${method.name}`}</p>
                    <p className="secondaryF">{`${method.account}`}</p>
                  </div>
                  <MdDelete
                    className="text-2xl mb-3 cursor-pointer"
                    color="red"
                    onClick={() => handleDelPaymentMethod(method)}
                  />
                </div>
              ))
            ) : (
              <>
              <p className="secondaryF">No payment methods available yet.</p>
              </>
            )}
            {isEditing ? (
              <>
                <div className="">
                  <div className="mr-52">
                    <FormText
                      placeholder="Name"
                      name="name"
                      onChange={handleInputChange}
                      value={newPaymentMethod.name}
                    />
                  </div>
                  <div className="mr-52">
                    <FormText
                      placeholder="Account"
                      name="account"
                      onChange={handleInputChange}
                      value={newPaymentMethod.account}
                    />
                  </div>
                </div>
                <FaRegSave
                  onClick={handleAddPaymentMethod}
                  className="text-2xl mt-2 cursor-pointer"
                />
              </>
            ) : (
              <IoMdAdd onClick={handleAddToggle} className="text-2xl cursor-pointer" />
            )}
          </>
        )}
      </div>
    </li>
  );
};

export default PaymentField;
