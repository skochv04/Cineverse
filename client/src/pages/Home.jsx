import './styles/Home.css'
import Header from "./Header.jsx";

import React, {useEffect} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import MoviesContainer from "./MoviesContainer.jsx";

function Home() {

    return (
        <div id="Home">
            <div id="header_container">
                <Header/>
            </div>
            <div id="content_container">
                <div id="content">
                    <div id="for_title">
                        <h2>Welcome.</h2>
                        <p>Enchanting stories come to life on the silver screen, offering a journey of emotions and
                            adventures for every movie enthusiast.</p>
                    </div>
                    <div id="for_search">
                        <input type="text" name="search_field" placeholder="Search for movie..."/>
                        <button>Search</button>
                    </div>
                </div>
            </div>
            <MoviesContainer />
        </div>
    );
}

export default Home