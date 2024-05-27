import React, { useState } from "react";
import Modal from "react-modal";
import Header from "./Header.jsx";
import "./styles/Admin.css";

Modal.setAppElement("#root");

function Admin() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", action: null });
    const [error, setError] = useState(null);
    const [currentMode, setCurrentMode] = useState("View Data");

    const [newCategory, setNewCategory] = useState('');
    const [newMovie, setNewMovie] = useState('');

    const [newMovieStartDate, setNewMovieStartDate] = useState('');
    const [newMovieEndDate, setNewMovieEndDate] = useState('');
    const [newDuration, setNewDuration] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newImagePath, setNewImagePath] = useState('');
    const [newDirector, setNewDirector] = useState('');
    const [newMinAge, setNewMinAge] = useState('');
    const [newProduction, setNewProduction] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [newRank, setNewRank] = useState('');

    const [newDate, setNewDate] = useState('');
    const [newScreeningStartTime, setNewScreeningStartTime] = useState('');
    const [newPriceStandard, setNewPriceStandard] = useState('');
    const [newPricePremium, setNewPricePremium] = useState('');
    const [newThreeDimensional, setNewThreeDimensional] = useState('');
    const [newScreeningLanguage, setNewScreeningLanguage] = useState('');
    const [newMovieHall, setNewMovieHall] = useState('');

    const [newDays, setNewDays] = useState('');

    const [categories, setCategories] = useState([]);
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const [screenings, setScreenings] = useState([]);
    const [selectedScreening, setSelectedScreening] = useState(null);

    const [newRevenueDate, setNewRevenueDate] = useState('');
    const [revenue, setRevenue] = useState(null);

    const [average, setAverage] = useState([]);

    const openModal = (title, action) => {
        setModalContent({ title, action });
        setModalIsOpen(true);
        setError(null);

        if (title === "View Categories") {
            fetchCategories();
        }

        else if (title === "View Movies") {
            fetchMovies();
        }

        else if (title === "View Movie Screenings") {
            fetchMovieScreenings();
        }

        else if (title === "Show average prices per category over past/upcoming 6 months") {
            fetchAverage();
        }

        setSelectedMovie(null);
        setSelectedScreening(null);
        setRevenue(null);
    };

    const handleClick = (movie) => {
        setSelectedMovie(movie);
        setModalContent({ title: movie.title, action: null }); // Змінюємо заголовок на назву фільму
        setModalIsOpen(true); // Відкриваємо модальне вікно
    };

    const handleBack = () => {
        setSelectedMovie(null); // Очищаємо вибраний фільм
        setModalContent({ title: "View Movies", action: null }); // Повертаємо заголовок на "View Movies"
    };

    const handleScreeningClick = (screening) => {
        setSelectedScreening(screening);
        setModalContent({ title: screening.title, action: null }); // Змінюємо заголовок на назву фільму
        setModalIsOpen(true); // Відкриваємо модальне вікно
    };

    const handleScreeningBack = () => {
        setSelectedScreening(null);
        setModalContent({ title: "View Movie Screenings", action: null });
    };

    const handleRevenueClick = () => {
        fetchRevenue();
        setModalIsOpen(true); // Відкриваємо модальне вікно
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleCategory = async () => {
        if (!newCategory.trim()) {
            setError("Category name cannot be empty.");
            return;
        }

        if (modalContent.action) {
            await modalContent.action();
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/handle_movie_category/', {
                method: modalContent.title === "Add New Category" ? 'POST' : 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category_name: newCategory }),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`);
            }

            setError(modalContent.title === "Add New Category" ? "Category was added successfully!" : "Category was deleted successfully!");

            const result = await response.json();
            console.log(result.message);

            setNewCategory('');
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteMovieByName = async () => {
        if (!newMovie.trim()) {
            setError("Movie name cannot be empty.");
            return;
        }

        if (modalContent.action) {
            await modalContent.action();
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/delete_movie_by_name/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ movie_name: newMovie }),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`);
            }

            setError(modalContent.title === "Movie was deleted successfully!");

            const result = await response.json();
            console.log(result.message);

            setNewMovie('');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleMovie = async () => {
        if (!newCategory.trim() || !newMovie.trim() || !newMovieStartDate.trim() || !newMovieEndDate.trim() || !newDuration.trim() || !newDescription.trim() || !newImagePath.trim() || !newDirector.trim() || !newMinAge.trim() || !newProduction.trim() || !newLanguage.trim() || !newRank.trim()) {
            setError("Please fill out all fields.");
            return;
        }

        if (modalContent.action) {
            await modalContent.action();
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/handle_movie/', {
                method: modalContent.title === "Add New Movie" ? 'POST' : 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    moviecategory: newCategory,
                    title: newMovie,
                    startdate: newMovieStartDate,
                    enddate: newMovieEndDate,
                    duration: newDuration,
                    description: newDescription,
                    image: newImagePath,
                    director: newDirector,
                    minage: newMinAge,
                    production: newProduction,
                    originallanguage: newLanguage,
                    rank: newRank
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`);
            }

            setError(modalContent.title === "Add New Movie" ? "Movie was added successfully!" : "Movie was updated successfully!");

            const result = await response.json();
            console.log(result.message);

            setNewCategory('');
            setNewMovie('');
            setNewMovieStartDate('');
            setNewMovieEndDate('');
            setNewDuration('');
            setNewDescription('');
            setNewImagePath('');
            setNewDirector('');
            setNewMinAge('');
            setNewProduction('');
            setNewLanguage('');
            setNewRank('');

        } catch (error) {
            setError(error.message);
        }
    };

    const handleMovieScreening = async () => {
        if (
            !newMovie.trim() ||
            !newDate.trim() ||
            !newScreeningStartTime.trim() ||
            !newPriceStandard.trim() ||
            !newPricePremium.trim() ||
            !newThreeDimensional === undefined ||
            !newScreeningLanguage.trim() ||
            !newMovieHall.trim() ||
            !newDays.trim()
        ) {
            setError("Please fill out all fields.");
            return;
        }

        if (modalContent.action) {
            await modalContent.action();
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/handle_movie_screening/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newMovie,
                    date: newDate,
                    starttime: newScreeningStartTime,
                    pricestandard: newPriceStandard,
                    pricepremium: newPricePremium,
                    threedimensional: newThreeDimensional,
                    language: newScreeningLanguage,
                    moviehall: newMovieHall,
                    repeatcount: newDays
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`);
            }

            setError("Week-Templated MovieScreening were added successfully!");

            const result = await response.json();
            console.log(result.message);

            setNewMovie('');
            setNewDate('');
            setNewScreeningStartTime('');
            setNewPriceStandard('');
            setNewPricePremium('');
            setNewThreeDimensional('');
            setNewScreeningLanguage('');
            setNewMovieHall('');
            setNewDays('');

        } catch (error) {
            setError(error.message);
        }
    };

    const deleteMovieScreening = async () => {
        if (
            !newMovie.trim() ||
            !newDate.trim() ||
            !newScreeningStartTime.trim()
        ) {
            setError("Please fill out all fields.");
            return;
        }

        if (modalContent.action) {
            await modalContent.action();
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/delete_movie_screening/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newMovie,
                    date: newDate,
                    starttime: newScreeningStartTime,
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`);
            }

            setError("MovieScreening was deleted successfully!");

            const result = await response.json();
            console.log(result.message);

            setNewMovie('');
            setNewDate('');
            setNewScreeningStartTime('');

        } catch (error) {
            setError(error.message);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/categories/');
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchMovies = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/movies/');
            if (!response.ok) {
                throw new Error(`Failed to fetch movies: ${response.status} - ${response.statusText}`);
            }
            const moviesData = await response.json();
            setMovies(moviesData);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchMovieScreenings = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/movie-screenings/');
            if (!response.ok) {
                throw new Error(`Failed to fetch movie screenings: ${response.status} - ${response.statusText}`);
            }
            const screeningsData = await response.json();
            setScreenings(screeningsData);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchRevenue = async () => {
        if (
            !newMovie.trim() ||
            !newRevenueDate.trim()
        ) {
            setError("Please fill out all fields.");
            return;
        }

        if (modalContent.action) {
            await modalContent.action();
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/movies-revenue/?title=${encodeURIComponent(newMovie)}&date=${encodeURIComponent(newRevenueDate)}`);

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`);
            }
            setError('');
            const revenue_data = await response.json();
            setRevenue(revenue_data);

            console.log(revenue_data.message);

            setNewMovie('');
            setNewRevenueDate('');

        } catch (error) {
            setError(error.message);
        }
    };

    const fetchAverage = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/categories-average/');
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            setAverage(data);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="Admin">
            <div id="header_container">
                <Header />
            </div>
            <div className="mode-switcher">
                <button
                    className={currentMode === "View Data" ? "active" : ""}
                    onClick={() => setCurrentMode("View Data")}
                >
                    View Data
                </button>
                <button
                    className={currentMode === "Data manager" ? "active" : ""}
                    onClick={() => setCurrentMode("Data manager")}
                >
                    Data manager
                </button>
                <button
                    className={currentMode === "Data analysis" ? "active" : ""}
                    onClick={() => setCurrentMode("Data analysis")}
                >
                    Data analysis
                </button>
            </div>

            {currentMode === "View Data" && (
                <>
                    <h2>View Data</h2>
                    <div className="container">
                        <button className="blue" onClick={() => openModal("View Categories")}>View Categories</button>
                        <button className="blue" onClick={() => openModal("View Movies")}>View Movies</button>
                        <button className="blue" onClick={() => openModal("View Movie Screenings")}>View Movie Screenings</button>
                    </div>
                </>
            )}

            {currentMode === "Data manager" && (
                <>
                    <h2>MovieCategories</h2>
                    <div className="container">
                        <button className="green" onClick={() => openModal("Add New Category")}>Add New Category</button>
                        <button className="red" onClick={() => openModal("Delete Category")}>Delete Category</button>
                    </div>

                    <h2>Movies</h2>
                    <div className="container">
                        <button className="green" onClick={() => openModal("Add New Movie", handleMovie)}>Add New Movie</button>
                        <button className="white" onClick={() => openModal("Update Movie", handleMovie)}>Update Movie</button>
                        <button className="red" onClick={() => openModal("Delete Movie")}>Delete Movie</button>

                    </div>

                    <h2>MovieScreening</h2>
                    <div className="container">
                        <button className="green" onClick={() => openModal("Add Week-Templated Movie Screenings")}>Add Week-Templated Movie Screenings</button>
                        <button className="red" onClick={() => openModal("Delete Movie Screening")}>Delete Movie Screening</button>
                    </div>
                </>
            )}

            {currentMode === "Data analysis" && (
                <>
                    <h2>MovieScreening</h2>
                    <div className="container">
                        <button className="blue" onClick={() => openModal("Show Moviescreenings by Hall")}>Show Moviescreenings by Hall</button>
                        <button className="blue" onClick={() => openModal("Show revenue for Movie on OrderDate")}>Show revenue for Movie on OrderDate</button>
                        <button className="blue" onClick={() => openModal("Show average prices per category over past/upcoming 6 months")}>Show average prices per category over past/upcoming 6 months</button>
                    </div>
                </>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Action Modal"
                className="Modal"
                overlayClassName="Overlay"
            >
                <h2>{modalContent.title}</h2>
                {(modalContent.title === "Add New Category" || modalContent.title === "Delete Category") && (
                    <div>
                        <label>
                            Category Name:
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                        </label>
                        <button onClick={handleCategory}>Confirm</button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                )}

                {(modalContent.title === "Delete Movie") && (
                    <div>
                        <label>
                            Movie Name:
                            <input
                                type="text"
                                value={newMovie}
                                onChange={(e) => setNewMovie(e.target.value)}
                            />
                        </label>
                        <button onClick={deleteMovieByName}>Confirm</button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                )}

                {(modalContent.title === "Add New Movie" || modalContent.title === "Update Movie") && (
                    <div>
                        <div className="all-modals">
                            <div className="left-modal">
                                <label>
                                    Movie title:
                                    <input
                                        type="text"
                                        value={newMovie}
                                        onChange={(e) => setNewMovie(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Category name:
                                    <input
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Start date:
                                    <input
                                        type="date"
                                        value={newMovieStartDate}
                                        onChange={(e) => setNewMovieStartDate(e.target.value)}
                                    />
                                </label>
                                <label>
                                    End date:
                                    <input
                                        type="date"
                                        value={newMovieEndDate}
                                        onChange={(e) => setNewMovieEndDate(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Minimal age:
                                    <input
                                        type="number"
                                        value={newMinAge}
                                        onChange={(e) => setNewMinAge(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Duration:
                                    <input
                                        type="number"
                                        value={newDuration}
                                        onChange={(e) => setNewDuration(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="right-modal">

                                <label>
                                    Description:
                                    <input
                                        type="text"
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Image path (you can give "undefined"):
                                    <input
                                        type="text"
                                        value={newImagePath}
                                        onChange={(e) => setNewImagePath(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Director:
                                    <input
                                        type="text"
                                        value={newDirector}
                                        onChange={(e) => setNewDirector(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Production:
                                    <input
                                        type="text"
                                        value={newProduction}
                                        onChange={(e) => setNewProduction(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Language:
                                    <input
                                        type="text"
                                        value={newLanguage}
                                        onChange={(e) => setNewLanguage(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Rank:
                                    <input
                                        type="number"
                                        value={newRank}
                                        onChange={(e) => setNewRank(e.target.value)}
                                    />
                                </label>
                            </div>
                        </div>

                        <button onClick={handleMovie}>Confirm</button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                )}

                {(modalContent.title === "Add Week-Templated Movie Screenings") && (
                    <div>
                        <div className="all-modals">
                            <div className="left-modal">
                                <label>
                                    Movie title:
                                    <input
                                        type="text"
                                        value={newMovie}
                                        onChange={(e) => setNewMovie(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Date:
                                    <input
                                        type="date"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Start time:
                                    <input
                                        type="time"
                                        value={newScreeningStartTime}
                                        onChange={(e) => setNewScreeningStartTime(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Is 3D?:
                                    <input
                                        type="checkbox"
                                        checked={newThreeDimensional}
                                        onChange={(e) => setNewThreeDimensional(e.target.checked)}
                                    />
                                </label>

                            </div>
                            <div className="right-modal">

                                <label>
                                    Price standard:
                                    <input
                                        type="number"
                                        value={newPriceStandard}
                                        onChange={(e) => setNewPriceStandard(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Price premium:
                                    <input
                                        type="number"
                                        value={newPricePremium}
                                        onChange={(e) => setNewPricePremium(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Language:
                                    <input
                                        type="text"
                                        value={newScreeningLanguage}
                                        onChange={(e) => setNewScreeningLanguage(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Movie hall:
                                    <input
                                        type="number"
                                        value={newMovieHall}
                                        onChange={(e) => setNewMovieHall(e.target.value)}
                                    />
                                </label>
                            </div>
                        </div>

                        <label>
                            How much days since given date?
                            <input
                                type="number"
                                value={newDays}
                                onChange={(e) => setNewDays(e.target.value)}
                            />
                        </label>

                        <button onClick={handleMovieScreening}>Confirm</button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                )}

                {(modalContent.title === "Delete Movie Screening") && (
                    <div>
                        <div className="all-modals">

                            <label>
                                Movie title:
                                <input
                                    type="text"
                                    value={newMovie}
                                    onChange={(e) => setNewMovie(e.target.value)}
                                />
                            </label>
                            <label>
                                Date:
                                <input
                                    type="date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                />
                            </label>
                            <label>
                                Start time:
                                <input
                                    type="time"
                                    value={newScreeningStartTime}
                                    onChange={(e) => setNewScreeningStartTime(e.target.value)}
                                />
                            </label>
                        </div>

                        <button onClick={deleteMovieScreening}>Confirm</button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                )}


                {modalContent.title === "View Categories" && (
                    <div className="modal-model">
                        <div className="modal-content-scrollable">
                            {categories.length > 0 ? (
                                <ul className="category-list">
                                    {categories.map((category, index) => (
                                        <li key={index}>{category.categoryname}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No categories available.</p>
                            )}
                        </div>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                )}

                {modalContent.title === "View Movies" && (
                    <div className="modal-model">
                        <div className="modal-content-scrollable">
                            {movies.length > 0 ? (
                                <ul className="movie-list">
                                    {movies.map((movie, index) => (
                                        <li key={index}>
                                            <button class="list-button" onClick={() => handleClick(movie)}>{movie.title}</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No movies available.</p>
                            )}

                        </div>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                )}

                {selectedMovie && (
                    <div className="modal-content-scrollable">
                        <div className="movie-details-img">
                            {selectedMovie.image && <img src={`data:image/jpeg;base64,${selectedMovie.image}`} alt={selectedMovie.title} />}
                        </div>
                        <div className="movie-details">

                            <p><b>Category:</b> {selectedMovie.categoryname}</p>
                            <p><b>Start date:</b> {selectedMovie.startdate}</p>
                            <p><b>End date:</b> {selectedMovie.enddate}</p>
                            <p><b>Duration:</b> {selectedMovie.duration}</p>
                            <p><b>Description:</b> {selectedMovie.description}</p>
                            <p><b>Minage:</b> {selectedMovie.minage}</p>
                            <p><b>Director:</b> {selectedMovie.director}</p>
                            <p><b>Production:</b> {selectedMovie.production}</p>
                            <p><b>Original language:</b> {selectedMovie.originallanguage}</p>
                            <p><b>Rank:</b> {selectedMovie.rank}</p>

                            <button onClick={handleBack}>Back</button>
                        </div>

                    </div>
                )}

                {modalContent.title === "View Movie Screenings" && (
                    <div className="modal-model">
                        <div className="modal-content-scrollable">
                            {screenings.length > 0 ? (
                                <ul className="movie-list">
                                    {screenings.map((screening, index) => (
                                        <li key={index}>
                                            <button class="list-button" onClick={() => handleScreeningClick(screening)}>{screening.title} - {screening.date} {screening.starttime}</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No movie screenings available.</p>
                            )}
                        </div>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                )}

                {selectedScreening && (
                    <div className="modal-content-scrollable">
                        <div className="movie-details-img">
                            {selectedScreening.image && <img src={`data:image/jpeg;base64,${selectedScreening.image}`} alt={selectedScreening.title} />}
                        </div>
                        <div className="movie-details">
                            <p><b>Date:</b> {selectedScreening.date}</p>
                            <p><b>Starttime:</b> {selectedScreening.starttime}</p>
                            <p><b>Endtime:</b> {selectedScreening.endtime}</p>
                            <p><b>Pricestandard:</b> {selectedScreening.pricestandard}</p>
                            <p><b>Pricepremium:</b> {selectedScreening.pricepremium}</p>
                            <p><b>3D:</b> {selectedScreening.threedimensional ? "Yes" : "No"}</p>
                            <p><b>Language:</b> {selectedScreening.language}</p>
                            <p><b>Hallnumber:</b> {selectedScreening.hallnumber}</p>

                            <button onClick={handleScreeningBack}>Back</button>
                        </div>

                    </div>
                )}

                {(modalContent.title === "Show revenue for Movie on OrderDate") && (
                    <div>
                        <div className="all-modals">
                            <label>
                                Movie title:
                                <input
                                    type="text"
                                    value={newMovie}
                                    onChange={(e) => setNewMovie(e.target.value)}
                                />
                            </label>
                            <label>
                                Ordered on date:
                                <input
                                    type="date"
                                    value={newRevenueDate}
                                    onChange={(e) => setNewRevenueDate(e.target.value)}
                                />
                            </label>
                        </div>

                        <button onClick={() => handleRevenueClick()}>Confirm</button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                )}

                {revenue && (
                    <div className="modal-content-scrollable">
                        <div className="movie-details">
                            <p><b>Categoryname:</b> {revenue.categoryname}</p>
                            <p><b>Startdate:</b> {revenue.startdate}</p>
                            <p><b>Enddate:</b> {revenue.enddate}</p>
                            <p><b>Ordered on date:</b> {revenue.orderedondate}</p>
                            <p><b>Tickets bought:</b> {revenue.tickets_amount}</p>
                            <p><b>Revenue:</b> {revenue.revenue}</p>
                        </div>

                    </div>
                )}

                {modalContent.title === "Show average prices per category over past/upcoming 6 months" && (
                    <div className="modal-model">
                        <div className="modal-content-scrollable">
                            {average.length > 0 ? (
                                <ul className="category-list">
                                    {average.map((category, index) => (
                                        <li key={index}>
                                            <span><b>Category:</b> {category.categoryname} <br /></span>
                                            <span><b>Movies Screenings Amount:</b> {category.moviescreenings_amount} <br /></span>
                                            <span><b>Average Price (Standard):</b> {category.average_pricestandard} <br /></span>
                                            <span><b>Average Price (Premium):</b> {category.average_pricepremium} <br /></span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No categories available.</p>
                            )}
                        </div>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                )}
                {error && <div className="error">{error}</div>}
            </Modal>
        </div>
    );
}

export default Admin;
