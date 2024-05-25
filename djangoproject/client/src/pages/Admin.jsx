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
    const [newMovieScreening, setNewMovieScreening] = useState('');
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

    const openModal = (title, action) => {
        setModalContent({ title, action });
        setModalIsOpen(true);
        setError(null); // Reset error when opening a new modal
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
        if (!newCategory.trim() || !newMovie.trim() || !newMovieStartDate.trim() || !newMovieEndDate.trim()) {
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
                        <button className="green" onClick={() => openModal("Add New MovieScreening")}>Add New Movie</button>
                        <button className="green" onClick={() => openModal("Add Week-Templated Movie Screening")}>Add Week-Templated Movie Screening</button>
                        <button className="white" onClick={() => openModal("Update Movie Screening")}>Update Movie Screening</button>
                        <button className="red" onClick={() => openModal("Delete Movie Screening")}>Delete Movie Screening</button>
                    </div>
                </>
            )}

            {currentMode === "Data analysis" && (
                <>
                    <h2>MovieScreening</h2>
                    <div className="container">
                        <button className="blue" onClick={() => openModal("Show Moviescreenings by Hall")}>Show Moviescreenings by Hall</button>
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
                                        type="text"
                                        value={newMovieStartDate}
                                        onChange={(e) => setNewMovieStartDate(e.target.value)}
                                    />
                                </label>
                                <label>
                                    End date:
                                    <input
                                        type="text"
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
                                    Director:
                                    <input
                                        type="text"
                                        value={newProduction}
                                        onChange={(e) => setNewProduction(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Director:
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

                {error && <div className="error">{error}</div>}
            </Modal>
        </div>
    );
}

export default Admin;
