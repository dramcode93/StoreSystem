import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import { useI18nContext } from '../context/i18n-context';
import { Link } from 'react-router-dom';
import { Chart } from 'chart.js/auto';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaShoppingCart, FaDollarSign, FaChartLine, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';

const Home = ({ role, modal }) => {
  const { language, t } = useI18nContext();
  const productChartRef = useRef(null);
  const monthlyChartRef = useRef(null);
  const [refresh, setRefresh] = useState(false);
  const [date, setDate] = useState(new Date());
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`https://store-system-api.gleeze.com/api/products/customers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            sort: '-sold', // Assuming '-sales' sorts by sales in descending order
            limit: 5        // Limits the results to the top 5 products
          }
        });

        setBestSellingProducts(response.data.data);
        console.log(bestSellingProducts)
      } catch (error) {
        console.error("Error fetching best-selling products:", error);
      }
    };

    fetchBestSellingProducts();
  }, []);


  useEffect(() => {
    const productCtx = productChartRef.current.getContext('2d');
    const monthlyCtx = monthlyChartRef.current.getContext('2d');

    const productChart = new Chart(productCtx, {
      type: 'bar',
      data: {
        labels: ['Electronics', 'Furniture', 'Clothing', 'Books'],
        datasets: [{
          label: 'Sales',
          data: [120, 150, 180, 90],
          backgroundColor: [
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    const monthlyChart = new Chart(monthlyCtx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
          label: 'Monthly Sales',
          data: [300, 400, 350, 500, 600, 550, 700, 650, 750, 800, 900, 850],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          fill: true
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      productChart.destroy();
      monthlyChart.destroy();
    };
  }, [refresh]);

  const handleRefresh = () => {
    setRefresh(prev => !prev);
  };



  return (
    <div>
      <div className={`absolute top-28 dark:text-gray-900 -z-3 w-full ${language === "ar" ? "right-28" : "left-40"}`}>
        <div className="container mx-auto pt-4 px-4">
          <div className="d-flex items-center justify-evenly w-full">
            <div className="bg-gray-100 w-1/5 rounded flex items-center justify-between p-4">
              <div className="ml-3">
                <p className="mb-2">{t('Home.Sales')}</p>
                <h6 className="mb-0">150</h6>
              </div>
              <FaShoppingCart className="fs-3 text-blue-500" />
            </div>
            <div className="bg-gray-100 w-1/5 rounded flex items-center justify-between p-4">
              <div className="ml-3">
                <p className="mb-2">{t('Home.Revenue')}</p>
                <h6 className="mb-0">$45,000</h6>
              </div>
              <FaDollarSign className="fs-3 text-blue-500" />
            </div>
            <div className="bg-gray-100 w-1/5 rounded flex items-center justify-between p-4">
              <div className="ml-3">
                <p className="mb-2">{t('Home.Growth')}</p>
                <h6 className="mb-0">25%</h6>
              </div>
              <FaChartLine className="fs-3 text-blue-500" />
            </div>
            <div className={`bg-gray-100 w-1/5 rounded flex items-center justify-between p-4 ${language === "en" ? "mr-20" : ""}`}>
            <div className="ml-3">
                <p className="mb-2">{t('Home.Profit')}</p>
                <h6 className="mb-0">$10,000</h6>
              </div>
              <FaMoneyBillWave className="fs-3 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="container-fluid pt-4 px-4 ">
          <div className="d-flex align-items-center justify-content-center gap-5">
            <div className="w-4/12 ">
              <div className="bg-gray-100 text-center rounded p-4 h-80">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h6 className="fw-bold mb-0">{t('Home.SalesByProductCategory')}</h6>
                  <Link to="#" onClick={handleRefresh}>{t('Home.ShowAll')}</Link>
                </div>
                <canvas id="product-chart" ref={productChartRef}></canvas>
              </div>
            </div>
            <div className="w-4/12">
              <div className="bg-gray-100 text-center rounded p-4 pt-1 h-80">
                <div className="d-flex align-items-center justify-content-between my-4">
                  <h6 className="fw-bold mb-0">{t('Home.MonthlySales')}</h6>
                  <Link to="#" onClick={handleRefresh}>{t('Home.ShowAll')}</Link>
                </div>
                <canvas id="monthly-chart" ref={monthlyChartRef}></canvas>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center gap-5 my-4">
            <div className="w-4/12">
              <div className="bg-gray-100 text-center rounded p-4 h-80">
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="mb-0 fw-bold">{t('Home.Calendar')}</h6>
                </div>
                <div className="calendar-container">
                  <Calendar className='w-100 py-3'
                    onChange={setDate}
                    value={date}
                    tileClassName={({ date, view }) => {
                      if (date.getDay() === 0 || date.getDay() === 6) {
                        return 'weekend';
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="w-4/12 ">
              <div className="bg-gray-100 text-center rounded p-4 h-80">
                <h6 className="mb-4 fw-bold">{t('Home.BestSellingProducts')}</h6>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className='text-xm text-gray-900 uppercase'>
                    <tr className="text-center fs-6 bg-gray-500 tracking-wide bg-opacity-25 transition ease-out duration-200">
                      <th scope="col" className="px-5 py-2">{t('Home.ProductName')}</th>
                      <th scope="col" className="px-5 py-2">{t('Home.Sales')}</th>
                    </tr>
                  </thead>
                  <tbody className='text-center fs-6'>
                    {bestSellingProducts.map((product, index) => (
                      <tr key={index}>
                      <td className={`py-2 ${language === "en" ? "text-left pl-16" : ""}`}>{product.name}</td>
                      <td>{product.sold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
