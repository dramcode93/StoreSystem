import React from "react";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import Loading from "../Loading/Loading";
import FormText from "../../form/FormText";

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
    <li className="bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3 list-none">
      <div className="text-gray-200 font-bold text-xl">
        {label} :
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {value && value.length > 0 ? (
              value.map((method, index) => (
                <div
                  key={index}
                  className="text-white flex justify-between items-center w-4/5 gap-4"
                >
                  <div className="flex gap-4">
                    <p className="text-white w-40">{`${method.name}`}</p>
                    <p className="text-white">{`${method.account}`}</p>
                  </div>
                  <MdDelete
                    className="text-2xl mb-3 cursor-pointer"
                    onClick={() => handleDelPaymentMethod(method)}
                  />
                </div>
              ))
            ) : (
              <>
              <p className="text-white">No payment methods available yet.</p>
              <p className="text-white">Add New:</p>
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
