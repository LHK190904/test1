import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

function ItemCarousel({ items }) {
  const navigate = useNavigate();

  const handleViewDetail = (designID) => {
    navigate(`/product-details/${designID}`);
  };

  return (
    <Swiper
      pagination={{ clickable: true }}
      modules={[Pagination]}
      className="w-full"
      breakpoints={{
        640: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
    >
      {items.map((item, index) => (
        <SwiperSlide key={index} className="flex justify-center">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-2">
            <img
              src={item.listURLImage}
              alt={item.designName}
              className="w-full h-[300px] object-cover"
            />
            <div className="bg-black p-6">
              <h2 className="text-2xl mb-2 text-[#F7EF8A]">
                {item.designName}
              </h2>
              <p className="text-white mb-4">{item.description}</p>
              <p className="text-xl text-white">{item.category}</p>
              <button
                onClick={() => handleViewDetail(item.id)}
                className="mt-4 px-4 py-2 font-xl font-bold w-full bg-[#F7EF8A] hover:bg-gradient-to-br hover:from-white hover:to-[#fcec5f] text-black rounded"
              >
                XEM CHI TIẾT
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default ItemCarousel;
