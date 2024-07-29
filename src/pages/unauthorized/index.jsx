import React from "react";
import { useNavigate } from "react-router-dom";

function Unauthorize() {
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen bg-[#434343] flex flex-col items-center justify-center text-4xl text-white">
      <div>BẠN KHÔNG ĐƯỢC CẤP QUYỀN ĐỂ TRUY CẬP VÀO TRANG NÀY</div>
      <button
        className="mt-4 p-2 bg-blue-500 rounded-lg"
        onClick={() => navigate("/")}
      >
        QUAY VỀ TRANG CHỦ
      </button>
    </div>
  );
}

export default Unauthorize;
