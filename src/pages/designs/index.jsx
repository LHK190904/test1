import React, { useEffect, useState } from "react";
import ItemCarousel from "../../components/itemCarousel";
import axiosInstance from "../../services/axiosInstance";

function Designs() {
  const [idvProducts, setIdvProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(`design/getAllCompanyDesign`);
      const allProducts = response.data.result;

      // Filter products to only include those starting with 'IDV-'
      const filteredProducts = allProducts.filter((product) =>
        product.designName.startsWith("IDV-")
      );

      setIdvProducts(filteredProducts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-12 mb-4">
        <div className="col-start-2 col-span-10 text-white">
          <ItemCarousel items={idvProducts} slidesPerView={5} />
        </div>
      </div>
    </div>
  );
}

export default Designs;
