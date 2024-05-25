import React, { useState } from "react";
import Modal from "react-modal";
import Header from "./Header.jsx";
import "./styles/Admin.css";

Modal.setAppElement("#root");

function Admin() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", action: null });
    const [error, setError] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [newMovie, setNewMovie] = useState('');
    const [newMovieScreening, setNewMovieScreening] = useState('');

    const openModal = (title, action) => {
        setModalContent({ title, action });
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleConfirm = () => {
        if (modalContent.action) {
            modalContent.action();
        }
        closeModal();
    };

    const handleAddCategory = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/add_movie_category/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category_name: newCategory }),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`);
            }

            const result = await response.json();
            console.log(result.message);

            setNewCategory('');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="Admin">
            <div id="header_container">
                <Header />
            </div>
            <div className="container">
                <button onClick={() => openModal("Add New Category", handleAddCategory)}>Add New Category</button>
                <button onClick={() => openModal("Delete Category", () => {/* Delete category action */ })}>Delete Category</button>
                <button onClick={() => openModal("Add New Movie", handleAddMovie)}>Add New Movie</button>
                <button onClick={() => openModal("Update Movie", () => {/* Update movie action */ })}>Update Movie</button>
                <button onClick={() => openModal("Delete Movie", () => {/* Delete movie action */ })}>Delete Movie</button>
                <button onClick={() => openModal("Add New Movie Screening", handleAddMovieScreening)}>Add New Movie Screening</button>
                <button onClick={() => openModal("Add Week-Templated Movie Screening", () => {/* Add week-templated movie screening action */ })}>Add Week-Templated Movie Screening</button>
                <button onClick={() => openModal("Update Movie Screening", () => {/* Update movie screening action */ })}>Update Movie Screening</button>
                <button onClick={() => openModal("Delete Movie Screening", () => {/* Delete movie screening action */ })}>Delete Movie Screening</button>
                <button onClick={() => openModal("Show Moviescreenings by Hall", () => {/* Show moviescreenings by hall action */ })}>Show Moviescreenings by Hall</button>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Action Modal"
                className="Modal"
                overlayClassName="Overlay"
            >
                <h2>{modalContent.title}</h2>
                {modalContent.title === "Add New Category" && (
                    <div>
                        <label>
                            Category Name:
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                        </label>
                    </div>
                )}
                {modalContent.title === "Add New Movie" && (
                    <div>
                        <label>
                            Movie Title:
                            <input
                                type="text"
                                value={newMovie}
                                onChange={(e) => setNewMovie(e.target.value)}
                            />
                        </label>
                    </div>
                )}
                {modalContent.title === "Add New Movie Screening" && (
                    <div>
                        <label>
                            Movie Screening:
                            <input
                                type="text"
                                value={newMovieScreening}
                                onChange={(e) => setNewMovieScreening(e.target.value)}
                            />
                        </label>
                    </div>
                )}
                <button onClick={handleConfirm}>Confirm</button>
                <button onClick={closeModal}>Cancel</button>
            </Modal>
        </div>
    );
}

export default Admin;
