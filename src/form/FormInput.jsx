import React from "react";
import Loading from "../components/Loading/Loading";

function FormInput({
  label,
  type,
  name,
  value,
  placeholder,
  required,
  onChange,
  numberOnly,
  maxLength,
  onInput,
  msgExist,
  usernameInputTouched,
}) {
  const handleChange = (e) => {
    if (numberOnly) {
      const nonAlphabeticValue = e.target.value.replace(/[a-zA-Z]/g, "");
      e.target.value = nonAlphabeticValue;
      onChange(e);
    } else {
      onChange(e);
    }
  };

  return (
    <div className="">
      <label
        htmlFor={name}
        className="block mb-3 text-xl font-medium secondaryF outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        defaultValue={value}
        className="secondary secondaryF border border-gray-300 text-xl rounded-md block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none focus:border-orange-400 dark:focus:border-orange-400 duration-100 ease-linear"
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        onChange={numberOnly ? handleChange : onChange}
        onProgress={onInput}
      />
      {usernameInputTouched && msgExist && value && (
        <>
          <p
            className={` mb-0 ${
              msgExist === "Username is not available" ||
              msgExist === "اسم المستخدم غير متاح"
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {msgExist}
          </p>
        </>
      )}
    </div>
  );
}

export default FormInput;
