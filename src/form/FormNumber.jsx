import React from "react";

function FormNumber({
  label,
  name,
  value,
  placeholder,
  required,
  onChange,
  min = "0",
  max,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-3 text-xl font-medium secondaryF outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"
      >
        {label}
      </label>
      <input
        type="number"
        name= {name}
        id={name}
        value={value}
        className="secondary secondaryF border border-gray-300 text-xl rounded-md block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none focus:border-orange-400 dark:focus:border-orange-400 duration-100 ease-linear"
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        min={min}
        max={max}
      />
    </div>
  );
}

export default FormNumber;
