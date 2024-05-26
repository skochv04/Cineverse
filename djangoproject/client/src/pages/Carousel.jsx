import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y } from 'swiper/modules';
import { Link } from 'react-router-dom'; // Імпорт React Router Link
import './styles/Carousel.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Carousel = ({ slides }) => {
    return (
        <Swiper
            modules={[Navigation, Scrollbar, A11y]}
            spaceBetween={0}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            loop={true}
            breakpoints={{
                320: {
                    slidesPerView: 1,
                    spaceBetween: 5,
                },
                480: {
                    slidesPerView: 2,
                    spaceBetween: 5,
                },
                640: {
                    slidesPerView: 4,
                    spaceBetween: 5,
                },
                768: {
                    slidesPerView: 5,
                    spaceBetween: 5,
                },
                1024: {
                    slidesPerView: 6,
                    spaceBetween: 5,
                },
                1280: {
                    slidesPerView: 7,
                    spaceBetween: 5,
                },
                1440: {
                    slidesPerView: 8,
                    spaceBetween: 5,
                },
                1920: {
                    slidesPerView: 9,
                    spaceBetween: 5,
                }
            }}
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={index} className="custom-swiper-slide">
                        <div className="carousel-slide-container">
                            <Link to={`/movie/${slide.content}`}>
                            <img src={slide.imageUrl} alt={slide.content} className="carousel-image" />
                            <p className="carousel-caption">{slide.content}</p>
                            </Link>
                        </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default Carousel;