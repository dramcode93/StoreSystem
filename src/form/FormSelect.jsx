import React from "react";
import { useI18nContext } from "../components/context/i18n-context";

function FormSelect({ selectLabel, handleChange, options, value, name }) {
  const { t } = useI18nContext();

  return (
    <div>
      <label
        htmlFor={selectLabel}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"
      >
        {selectLabel}
      </label>

      <select
        onChange={handleChange}
        id={selectLabel}
        name={name}
        className="w-full p-2.5 dark:bg-gray-700 rounded-md
        dark:border-gray-600 dark:placeholder-gray-400
        dark:text-white outline-none border text-gray-700
        focus:border-orange-400 dark:focus:border-orange-400
        duration-100 ease-linear"
        value={value}
      >
        <option value={""}>{t("centerForm.select")}</option>
        {Array.isArray(options) &&
          options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    </div>
  );
}

export default FormSelect;
