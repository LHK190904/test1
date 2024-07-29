import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";

function PriceMaterial() {
  const [materialPrice, setMaterialPrice] = useState([]);
  const navigate = useNavigate();

  const fetchMaterialPrice = async () => {
    try {
      const response = await axiosInstance.get(`material/notGold`);
      setMaterialPrice(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMaterialPrice();
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen w-screen bg-[#434343] ">
      <div className="grid grid-cols-12 gap-4 pt-4">
        <div className="col-start-2 col-span-10 bg-gray-300 text-center p-1 rounded-lg">
          <h1 className="bg-gray-400 p-4 text-2xl font-bold">GIÁ VẬT LIỆU</h1>
          <div className="grid grid-cols-12 border">
            <div className="col-span-4 p-2 text-xl border">LOẠI VẬT LIỆU</div>
            <div className="col-span-3 p-2 text-xl border">GIÁ</div>
            <div className="col-span-5 p-2 text-xl border">
              THỜI ĐIỂM CẬP NHẬT
            </div>
          </div>
          {materialPrice.map((item, index) => (
            <div key={index} className="grid grid-cols-12 border">
              <div className="col-span-4 p-2 bg-white border text-left text-xl">
                {item.materialName}
              </div>
              <div className="col-span-3 p-2 bg-white border">
                {new Intl.NumberFormat().format(item.pricePerUnit)}
              </div>
              <div className="col-span-5 p-2 bg-white border">
                {new Date(item.updateTime).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <button
          className="col-start-8 col-span-4 bg-[#F7EF8A] hover:bg-gradient-to-br hover:from-white hover:to-[#fcec5f] text-xl p-4 font-bold rounded-lg"
          onClick={() => handleNavigate("/price/gold")}
        >
          GIÁ VÀNG
        </button>
      </div>
    </div>
  );
}

export default PriceMaterial;
