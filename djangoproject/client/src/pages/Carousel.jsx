import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation, Scrollbar, A11y, Autoplay} from 'swiper/modules';
import { Link } from 'react-router-dom';
import './styles/Carousel.css';

const PlaceholderSlide = () => (
    <div className="carousel-slide-container">
        <div className="placeholder-image" />
        <p className="carousel-caption">Loading...</p>
    </div>
);

const Carousel = ({ slides }) => {
    const slidesToRender = slides.length > 0 ? slides : Array(20).fill(null);

    return (
        <Swiper
            modules={[Navigation, Scrollbar, A11y, Autoplay]}
            spaceBetween={10}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            autoplay={{
                delay: 3000,
                disableOnInteraction: true,
            }}
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
            {slidesToRender.map((slide, index) => (
                <SwiperSlide key={index} className="custom-swiper-slide">
                    {slide ? (
                        <div className="carousel-slide-container">
                            <Link to={`/movie/${slide.content}`}>
                                <img src={slide.imageUrl} alt={slide.content} className="carousel-image" />
                                <p className="carousel-caption">{slide.content}</p>
                            </Link>
                        </div>
                    ) : (
                        <PlaceholderSlide />
                    )}
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default Carousel;
