import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleNavigate =
    (path, state = {}) =>
    () => {
      navigate(path, { state });
    };

  return (
    <div className="grid grid-cols-6 w-screen bg-[#2A2A2A] text-[#F7EF8A] font-bold z-10 sticky top-0">
      <button
        onClick={handleNavigate("/")}
        className="hover:text-[#ddd012] hover:bg-black p-4 rounded-lg"
      >
        TRANG CHỦ
      </button>
      <button
        onClick={handleNavigate("/about")}
        className="hover:text-[#ddd012] hover:bg-black p-4 rounded-lg"
      >
        THÔNG TIN
      </button>
      <button
        onClick={handleNavigate("/price/gold")}
        className="hover:text-[#ddd012] hover:bg-black p-4 rounded-lg"
      >
        GIÁ NGUYÊN VẬT LIỆU
      </button>
      <button
        onClick={handleNavigate("/collections")}
        className="hover:text-[#ddd012] hover:bg-black p-4 rounded-lg"
      >
        BỘ SƯU TẬP
      </button>
      <button
        onClick={handleNavigate("/collections", { scrollToDesigns: true })}
        className="hover:text-[#ddd012] hover:bg-black p-4 rounded-lg"
      >
        THIẾT KẾ
      </button>
      <button
        onClick={handleNavigate("/blog")}
        className="hover:text-[#ddd012] hover:bg-black p-4 rounded-lg"
      >
        BLOG
      </button>
    </div>
  );
}
