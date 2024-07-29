import React, { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";

function LatestTransaction() {
  const [latestTransactions, setLatestTransactions] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`dashboard/latest-transactions`);
      setLatestTransactions(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-center text-4xl font-bold">
        ĐƠN ĐÃ THANH TOÁN MỚI NHẤT
      </h2>
      <div className="grid grid-cols-9 text-xl border bg-gray-400">
        <div className="col-span-1 border p-2">MÃ ĐƠN</div>
        <div className="col-span-2 border p-2">TÊN KHÁCH HÀNG</div>
        <div className="col-span-3 border p-2">EMAIL</div>
        <div className="col-span-1 border p-2">SĐT</div>
        <div className="col-span-1 border p-2">TỔNG TIỀN</div>
        <div className="col-span-1 border p-2">THỜI ĐIỂM</div>
      </div>
      <div className="mt-2">
        {latestTransactions.map((item) => (
          <div key={item.id} className="grid grid-cols-9">
            <div className="col-span-1 text-center">{item.id}</div>
            <div className="col-span-2">{item.userName}</div>
            <div className="col-span-3">{item.email}</div>
            <div className="col-span-1 text-center">{item.phoneNum}</div>
            <div className="col-span-1 text-center">
              {new Intl.NumberFormat().format(item.amount)}
            </div>
            <div className="col-span-1">
              {new Date(item.paymentDate).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LatestTransaction;
