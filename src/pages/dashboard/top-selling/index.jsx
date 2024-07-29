import React, { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";

function TopSelling() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(
        `dashboard/top-selling-products`
      );
      setProducts(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="bg-white shadow rounded-lg p-2 mx-2">
      <h2 className="text-center text-4xl font-bold mt-2">
        CÁC SẢN PHẨM BÁN CHẠY
      </h2>
      <div className="grid grid-cols-5 text-xl bg-gray-400">
        <div className="col-span-1 border text-center">ID</div>
        <div className="col-span-2 border">TÊN SẢN PHẨM</div>
        <div className="col-span-1 border text-center">LƯỢT BÁN</div>
        <div className="col-span-1 border text-center">GIÁ</div>
      </div>
      <ul className="mt-2">
        {products.map((item) => (
          <div key={item.id} className="grid grid-cols-5">
            <span className="col-span-1 text-center ">{item.id}</span>
            <span className="col-span-2">{item.designName}</span>
            <span className="col-span-1 text-center">{item.order_count}</span>
            <span className="col-span-1 ">
              {new Intl.NumberFormat().format(item.price)}
            </span>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default TopSelling;
