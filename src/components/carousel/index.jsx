import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

function Carousel({ numberOfSlides = 1, images = [], autoplay = false }) {
  return (
    <div className="w-full">
      <Swiper
        autoplay={
          autoplay ? { delay: 2500, disableOnInteraction: false } : false
        }
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        className="w-full"
        slidesPerView={numberOfSlides}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="w-full">
            <img
              src={image}
              alt={`slide-${index}`}
              className="w-full h-auto object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Carousel;
