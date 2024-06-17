import React, { useCallback, useEffect, useState } from "react";
import Card from "../../form/Card";
import { ChalkboardSimple } from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
import Cookies from "js-cookie";
import axios from "axios";

const Shop = () => {
  const {language,t} = useI18nContext();
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);
  const [allMoney, setAllMoney] = useState(0);
  const [productsMoney, setProductsMoney] = useState(0);
  const [dailyEarning, setDailyEarning] = useState(0);
  const [dailySales, setDailySales] = useState(0);
  const [monthlyEarning, setMonthlyEarning] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [yearlyEarning, setYearlyEarning] = useState(0);
  const [yearlySales, setYearlySales] = useState(0);


  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const shopResponse = await axios.get(
          `https://store-system-api.gleeze.com/api/shops/myShop`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllMoney(shopResponse.data.data.allMoney);
        setProductsMoney(shopResponse.data.data.productsMoney);
        const dailyResponse = await axios.get(
          `https://store-system-api.gleeze.com/api/sales/daily/thisDay`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDailyEarning(dailyResponse.data.data.earnings);
        setDailySales(dailyResponse.data.data.sales);

        const monthlyResponse = await axios.get(
          `https://store-system-api.gleeze.com/api/sales/monthly/thisMonth`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMonthlyEarning(monthlyResponse.data.data.earnings);
        setMonthlySales(monthlyResponse.data.data.sales);

        const yearlyResponse = await axios.get(
          `https://store-system-api.gleeze.com/api/sales/yearly/thisYear`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setYearlyEarning(yearlyResponse.data.data.earnings);
        setYearlySales(yearlyResponse.data.data.sales);
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // setAllMoney(0);
        // setProductsMoney(0);
        setDailyEarning(0);
        setDailySales(0);
        setMonthlyEarning(0);
        setMonthlySales(0);
        setYearlyEarning(0);
        setYearlySales(0);
      } else {
        console.error("Error fetching data:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const formatMoney = (value) => {
    return value.toLocaleString(undefined, { maximumFractionDigits: 0 }) + " $";
  };

  return (
    <> 
      <div
        className={`mx-10 rounded-md pt-2 absolute top-32 -z-3 w-3/4 ${
          language === "ar" ? "left-10" : "right-10"
        }`}
      >
        <div className="d-flex justify-evenly items-center mb-4">
          <div className="flex justify-content-between align-center">
            <Card
              icon={<ChalkboardSimple size={60} />}
              id="id"
              name={t(`Shop.TotalMoney`)}
              rooms={formatMoney(allMoney)}
            />
          </div>
          <div className="flex justify-content-between align-center">
            <Card
              icon={<ChalkboardSimple size={60} />}
              id="id"
              name={t(`Shop.ProductsMoney`)}
              rooms={formatMoney(productsMoney)}
            />
          </div>
        </div>

        <div className="d-flex justify-around items-center">
          <div className="d-flex justify-around items-center flex-col gap-4">
            <div className="flex justify-content-between align-center">
              <Card
                icon={<ChalkboardSimple size={60} />}
                id="id"
                name={t(`Shop.DailySales`)}
                rooms={formatMoney(dailySales)}
              />
            </div>
            <div className="flex justify-content-between align-center">
              <Card
                icon={<ChalkboardSimple size={60} />}
                id="id"
                name={t(`Shop.DailyEarnings`)}
                rooms={formatMoney(dailyEarning)}
              />
            </div>
            <div>
          
            </div>
          </div>

          <div className="d-flex justify-around items-center flex-col gap-4">
            <div className="flex justify-content-between align-center ">
              <Card
                icon={<ChalkboardSimple size={60} />}
                id="id"
                name={t(`Shop.MonthlySales`)}
                rooms={formatMoney(monthlySales)}
              />
            </div>
            <div className="flex justify-content-between align-center">
              <Card
                icon={<ChalkboardSimple size={60} />}
                id="id"
                name={t(`Shop.MonthlyEarnings`)}
                rooms={formatMoney(monthlyEarning)}
              />
            </div>
            <div>
            </div>
          </div>

          <div className="d-flex justify-around items-center flex-col gap-4">
            <div className="flex justify-content-between align-center">
              <Card
                icon={<ChalkboardSimple size={60} />}
                id="id"
                name={t(`Shop.YearlySales`)}
                rooms={formatMoney(yearlySales)}
              />
            </div>
            <div className="flex justify-content-between align-center">
              <Card
                icon={<ChalkboardSimple size={60} />}
                id="id"
                name={t(`Shop.YearlyEarnings`)}
                rooms={formatMoney(yearlyEarning)}
              />
            </div>
            <div>
          
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
