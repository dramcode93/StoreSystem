import React, { useCallback, useEffect, useState } from "react";
import Card from "../../form/Card";
import { ChalkboardSimple } from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
import Cookies from "js-cookie";
import axios from "axios";
import { useParams } from "react-router-dom";

const FinancialDealings = () => {
  const { language, t } = useI18nContext();
  const { id } = useParams();
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState();
  const [allMoney, setAllMoney] = useState();
  const [productsMoney, setProductsMoney] = useState();
  const [dailyEarning, setDailyEarning] = useState();
  const [dailySales, setDailySales] = useState();
  const [monthlyEarning, setMonthlyEarning] = useState();
  const [monthlySales, setMonthlySales] = useState();
  const [yearlyEarning, setYearlyEarning] = useState();
  const [yearlySales, setYearlySales] = useState();

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        try {
          const subShopResponse = await axios.get(
            `https://store-system-api.gleeze.com/api/subShops/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setAllMoney(subShopResponse.data.data.allMoney);
          setProductsMoney(subShopResponse.data.data.productsMoney);
          setDebts(subShopResponse.data.data.debts);
        } catch (error) {
          console.error("Error fetching sub shop data:", error);
        }
  
        try {
          const dailyResponse = await axios.get(
            `https://store-system-api.gleeze.com/api/subSales/daily/thisDay?subShop=${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDailyEarning(dailyResponse.data.data.earnings);
          setDailySales(dailyResponse.data.data.sales);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setDailyEarning(0);
            setDailySales(0);
          } else {
            console.error("Error fetching daily sales data:", error);
          }
        }
  
        try {
          const monthlyResponse = await axios.get(
            `https://store-system-api.gleeze.com/api/subSales/monthly/thisMonth?subShop=${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMonthlyEarning(monthlyResponse.data.data.earnings);
          setMonthlySales(monthlyResponse.data.data.sales);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setMonthlyEarning(0);
            setMonthlySales(0);
          } else {
            console.error("Error fetching monthly sales data:", error);
          }
        }
  
        try {
          const yearlyResponse = await axios.get(
            `https://store-system-api.gleeze.com/api/subSales/yearly/thisYear?subShop=${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setYearlyEarning(yearlyResponse.data.data.earnings);
          setYearlySales(yearlyResponse.data.data.sales);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setYearlyEarning(0);
            setYearlySales(0);
          } else {
            console.error("Error fetching yearly sales data:", error);
          }
        }
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [token, id]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatMoney = (value) => {
    if (value != null) {
      return (
        value.toLocaleString(undefined, { maximumFractionDigits: 0 }) + " $"
      );
    }

    return "";
  };

  return (
    <>
      <div
        className={`mx-10 rounded-md pt-2 absolute top-32 -z-3 w-3/4 ${
          language === "ar" ? "left-10" : "right-10"
        }`}
      >
        <div className="d-flex justify-around items-center mb-4">
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
          <div className="flex justify-content-between align-center">
            <Card
              icon={<ChalkboardSimple size={60} />}
              id="id"
              name="Debts"
              rooms={formatMoney(debts)}
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
            <div></div>
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
            <div></div>
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
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancialDealings;
