import React from "react";

function FormSelect({ selectLabel, handleChange, options, value, name, headOption }) {
  return (
    <div>
      <label
        htmlFor={selectLabel}
        className="block mb-3 text-xl font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"
      >
        {selectLabel}
      </label>

      <select
        onChange={handleChange} // Pass the handleChange function
        id={selectLabel}
        name={name}
        className="bg-gray-50 border border-gray-300 text-xl rounded-md block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none focus:border-orange-400 dark:focus:border-orange-400 duration-100 ease-linear"
        value={value}
      >
        <option value="" disabled>{headOption}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FormSelect;
