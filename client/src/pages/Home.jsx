import './styles/Home.css'
import Header from "./Header.jsx";

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
            <div id="fresh_movies_container">
                <h2>Tu będą kiedys</h2>
                <h2>Zdjęcia filmów</h2>
            </div>
        </div>
    );
}

export default Home