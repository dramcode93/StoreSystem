import React from "react";

function FormText({ label, name, value, placeholder, required, onChange }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 text-xl font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"
      >
        {label}
      </label>
      <input
        type="text"
        name={name}
        id={name}
        defaultValue={value}
        className="bg-gray-50 border border-gray-300 text-xl rounded-md block w-full p-2.5 dark:bg-gray-600  dark:border-gray-600 dark:placeholder-gray-400  dark:text-white outline-none  focus:border-orange-400 dark:focus:border-orange-400 duration-100 ease-linear"
        placeholder={placeholder}
        required={required}
        onChange={onChange}
      />
    </div>
  );
}

export default FormText;
