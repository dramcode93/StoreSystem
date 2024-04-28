import React, { useState, useEffect, useCallback } from "react";
import FormText from "../../form/FormText";
import FormNumber from "../../form/FormNumber";
import { useI18nContext } from "../context/i18n-context";
import FormInput from "../../form/FormInput";
import FormSelect from "../../form/FormSelect";
import axios from "axios";

const Customers = () => {
  const { t, language } = useI18nContext();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        const response = await axios.get(
          "https://store-system-api.gleeze.com/api/governorates"
        );
        setGovernorates(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching governorates:", error);
        setLoading(false);
      }
    };
    fetchGovernorates();
  }, []);

  const fetchCities = async (governorateId) => {
    try {
      const response = await axios.get(
        `https://store-system-api.gleeze.com/api/cities?governorate=${governorateId}`
      );
      setCities(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setLoading(false);
    }
  };
  const handleGovernorateChange = (e) => {
    const selectedGovernorateId = e.target.value;
    setSelectedGovernorate(selectedGovernorateId);
    fetchCities(selectedGovernorateId);
  };

  return (
    <div>
      <section className="bg-gray-700 bg-opacity-25 mx-10 rounded-md p-5 absolute top-40 w-3/4 flex items-center justify-center">
        <form className="p-0 m-0">
          <FormInput
            label="Name:"
            name="Name"
            onChange={() => {}}
            placeholder="Name"
          />
          <FormNumber
            label="Phone Number:"
            name="Phone"
            onChange={() => {}}
            placeholder="Phone Number"
          />
          <FormSelect
            selectLabel="Governorate:"
            headOption="Select Governorate"
            handleChange={handleGovernorateChange}
            options={governorates.map((governorate) => ({
              value: governorate._id,
              label:
                language === "ar"
                  ? governorate.governorate_name_ar
                  : governorate.governorate_name_en,
            }))}
            value={selectedGovernorate}
            name="governorate"
          />
          {selectedGovernorate && (
            <FormSelect
              selectLabel="City:"
              headOption="Select City"
              handleChange={(e) => {
                setSelectedCity(e.target.value);
              }}
              options={cities.map((city) => ({
                value: city._id,
                label:
                  language === "ar" ? city.city_name_ar : city.city_name_en,
              }))}
              value={selectedCity}
              name="city"
            />
          )}
          <div className="col-span-2 flex justify-center">
            <button className="bg-yellow-900 w-1/2 h-12 rounded-md hover:bg-yellow-800 fw-bold text-xl">
              Add Customer +
            </button>
            <div>&nbsp;</div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Customers;
