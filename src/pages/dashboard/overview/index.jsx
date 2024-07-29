import React, { useEffect, useState } from "react";
import axiosInstace from "../../../services/axiosInstance";

function Overview() {
  const [totalSales, setTotalSales] = useState([]);
  const [orderComplete, setOrderComplete] = useState([]);
  const [totalRequests, setTotalRequests] = useState([]);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const lastMonth = new Date().getMonth();

  const fetchData = async () => {
    try {
      const responseTotalSales = await axiosInstace.get(
        `dashboard/monthly-revenue?year=${currentYear}&startMonth=${lastMonth}&endMonth=${currentMonth}`
      );
      setTotalSales(responseTotalSales.data.result);

      const responseOrderComplete = await axiosInstace.get(
        `dashboard/monthly-order-complete-count?year=${currentYear}&startMonth=${lastMonth}&endMonth=${currentMonth}`
      );
      setOrderComplete(responseOrderComplete.data.result);

      const responseTotalRequests = await axiosInstace.get(
        `dashboard/monthly-request-count?year=${currentYear}&startMonth=${lastMonth}&endMonth=${currentMonth}`
      );
      setTotalRequests(responseTotalRequests.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getValueForMonth = (data, month, key) => {
    const item = data.find((item) => item.month === month);
    return item ? item[key] : 0;
  };

  const calculateDifference = (data, key) => {
    const valueLastMonth = getValueForMonth(data, lastMonth, key);
    const valueCurrentMonth = getValueForMonth(data, currentMonth, key);

    return valueCurrentMonth - valueLastMonth;
  };

  const getTextColor = (difference) => {
    return difference < 0 ? "text-red-500 text-xl" : "text-green-500 text-xl";
  };

  return (
    <div className="grid grid-cols-12 m-2">
      <div className="col-span-4 bg-white p-2 mx-2 rounded-lg">
        <div className="text-2xl font-bold">Total Sales</div>
        <div
          className={getTextColor(
            calculateDifference(totalSales, "totalProfit")
          )}
        >
          {new Intl.NumberFormat().format(
            calculateDifference(totalSales, "totalProfit")
          )}
        </div>
        <div>from last month</div>
      </div>
      <div className="col-span-4 bg-white p-2 mx-2 rounded-lg">
        <div className="text-2xl font-bold">Order Complete</div>
        <div
          className={getTextColor(
            calculateDifference(orderComplete, "orderCount")
          )}
        >
          {new Intl.NumberFormat().format(
            calculateDifference(orderComplete, "orderCount")
          )}
        </div>
        <div>from last month</div>
      </div>
      <div className="col-span-4 bg-white p-2 mx-2 rounded-lg">
        <div className="text-2xl font-bold">Total Requests</div>
        <div
          className={getTextColor(
            calculateDifference(totalRequests, "orderCount")
          )}
        >
          {new Intl.NumberFormat().format(
            calculateDifference(totalRequests, "orderCount")
          )}
        </div>
        <div>from last month</div>
      </div>
    </div>
  );
}

export default Overview;
