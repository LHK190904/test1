import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import React, { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";

function SaleTrend() {
  const year = "2024";
  const startMonth = "1";
  const endMonth = "12";
  const [revenue, setRevenue] = useState([]);
  const [orderCount, setOrderCount] = useState([]);

  const fetchRevenue = async () => {
    try {
      const responseRevenue = await axiosInstance.get(
        `dashboard/monthly-revenue?year=${year}&startMonth=${startMonth}&endMonth=${endMonth}`
      );
      setRevenue(responseRevenue.data.result.map((item) => item.totalProfit));

      const responseOrderCount = await axiosInstance.get(
        `dashboard/monthly-order-count?year=${year}&startMonth=${startMonth}&endMonth=${endMonth}`
      );
      setOrderCount(
        responseOrderCount.data.result.map((item) => item.orderCount)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const data = {
    labels: [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Profits",
        data: revenue,
        fill: true,
        backgroundColor: "#9CDFFF",
        borderColor: "#00ABFF",
      },
      {
        label: "Sales",
        data: orderCount,
        fill: true,
        backgroundColor: "#FFA8A8",
        borderColor: "#FF0000",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 m-4">
      <h2 className="text-4xl font-bold">SALES TRENDS</h2>
      <Line data={data} options={options} />
    </div>
  );
}

export default SaleTrend;
