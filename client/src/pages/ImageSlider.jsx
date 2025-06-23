import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import a1 from '../assets/1.webp';
import a2 from '../assets/2.webp';
import a3 from '../assets/3.webp';

const ImageSlider = () => {
    const images = [a1, a2, a3];

    return (
        <div className="w-full max-w-7xl mx-auto py-8">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                className="rounded-xl shadow-lg"
            >
                {images.map((src, index) => (
                    <SwiperSlide key={index}>
                        <img 
                            src={src} 
                            alt={`Slide ${index + 1}`} 
                            className="w-full h-auto object-contain rounded-xl" /* Adjusted height to auto */
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ImageSlider;
