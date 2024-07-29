import { useRef, useEffect, useState } from "react";
import Carousel from "../../components/carousel";
import ItemCarousel from "../../components/itemCarousel";
import { useLocation } from "react-router-dom";
import Designs from "../designs";
import axiosInstance from "../../services/axiosInstance";
import RevealAppear from "../../components/revealAppear";
import RevealFloatIn from "../../components/revealFloatIn";

const banners = [
  "./banner1.jpg",
  "./banner2.jpg",
  "./banner3.jpg",
  "./banner4.jpg",
  "./banner5.jpg",
];

export default function Collections() {
  const [collections, setCollections] = useState({});
  const designsRef = useRef(null);
  const location = useLocation();

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(`design/getAllCompanyDesign`);
      const allProducts = response.data.result;

      // Group products by collection name excluding 'IDV-'
      const groupedProducts = allProducts.reduce((acc, product) => {
        if (!product.designName.startsWith("IDV-")) {
          const collectionName = product.designName.split("-")[0];
          if (!acc[collectionName]) {
            acc[collectionName] = [];
          }
          acc[collectionName].push(product);
        }
        return acc;
      }, {});

      setCollections(groupedProducts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (location.state?.scrollToDesigns) {
      designsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="min-h-screen w-screen bg-[#434343] text-[#F7EF8A]">
      <Carousel numberOfSlides={1} images={banners} autoplay={true} />

      <div className="text-center text-4xl font-bold bg-[#434343] my-4">
        CÁC BỘ SƯU TẬP
      </div>

      {Object.keys(collections).map((collectionName, index) => (
        <div key={index} className="grid grid-cols-12 bg-[#434343]">
          <div className="col-start-2 col-span-1 text-4xl font-bold">
            <RevealFloatIn floatDirection={"left"}>
              {collectionName}
            </RevealFloatIn>
          </div>
          <div className="col-span-9 mb-10">
            <RevealFloatIn floatDirection={"right"}>
              <ItemCarousel items={collections[collectionName]} />
            </RevealFloatIn>
          </div>
        </div>
      ))}
      <RevealAppear>
        <h1 className="col-span-12 text-center text-4xl font-bold mb-10">
          CÁC MẪU THIẾT KẾ KHÁC
        </h1>
      </RevealAppear>
      <RevealAppear>
        <div ref={designsRef} className="col-start-2 col-span-10 pb-2">
          <Designs />
        </div>
      </RevealAppear>
    </div>
  );
}
