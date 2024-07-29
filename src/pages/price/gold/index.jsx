import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";

function PriceGold() {
  const [goldPrice, setGoldPrice] = useState([]);
  const navigate = useNavigate();

  const fetchGoldPrice = async () => {
    try {
      const responseGold = await axiosInstance.get(`api/gold/prices`);
      const goldData = responseGold.data.DataList.Data.map((item, index) => ({
        goldType: item[`@n_${index + 1}`],
        sellCost: item[`@pb_${index + 1}`],
        buyCost: item[`@pb_${index + 1}`],
        updated: item[`@d_${index + 1}`],
      }));
      setGoldPrice(goldData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGoldPrice();
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen w-screen bg-[#434343] py-4">
      <div className="grid grid-cols-12 gap-4 pt-4">
        <div className="col-start-2 col-span-10 bg-gray-300 text-center p-1 rounded-lg">
          <h1 className="bg-gray-400 p-4 text-2xl font-bold">GIÁ VÀNG</h1>
          <div className="grid grid-cols-12 border">
            <div className="col-span-3 p-2 text-xl border">LOẠI VÀNG</div>
            <div className="col-span-3 p-2 text-xl border">GIÁ BÁN</div>
            <div className="col-span-3 p-2 text-xl border">GIÁ MUA</div>
            <div className="col-span-3 p-2 text-xl border">THỜI ĐIỂM</div>
          </div>
          {goldPrice.map((item, index) => (
            <div key={index} className="grid grid-cols-12 border">
              <div className="col-span-3 p-2 bg-white border text-lg">
                {item.goldType}
              </div>
              <div className="col-span-3 p-2 bg-white border text-lg">
                {new Intl.NumberFormat().format(item.sellCost)}
              </div>
              <div className="col-span-3 p-2 bg-white border text-lg">
                {new Intl.NumberFormat().format(item.buyCost)}
              </div>
              <div className="col-span-3 p-2 bg-white border">
                {item.updated}
              </div>
            </div>
          ))}
        </div>
        <button
          className="col-start-8 col-span-4 bg-[#F7EF8A] hover:bg-gradient-to-br hover:from-white hover:to-[#fcec5f] text-xl p-4 font-bold rounded-lg"
          onClick={() => handleNavigate("/price/material")}
        >
          GIÁ ĐÁ
        </button>
      </div>
    </div>
  );
}

export default PriceGold;
