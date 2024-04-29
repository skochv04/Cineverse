import './styles/Home.css'

function Home() {
    return (
        <div id="Home">
            <div id="for_title">
                <h2>Welcome.</h2>
                <p>Enchanting stories come to life on the silver screen, offering a journey of emotions and adventures for every movie enthusiast.</p>
            </div>
            <div id="for_search">
                <input type="text" name="search_field" placeholder="Search for movie..." />
                <button>Search</button>
            </div>
        </div>
    );
}

export default Home