import React, { useState, useEffect } from "react";
import { getCsrfToken } from '../utils/csrf';
import Header from "./Header.jsx";
import "./styles/AboutUs.css";

function AboutUs() {
    const [availableSeats, setAvailableSeats] = useState([]);
    const [error, setError] = useState(null);
    const [newSeatNumber, setNewSeatNumber] = useState('');
    const [newMovieScreeningId, setNewMovieScreeningId] = useState('');
    const [newSeatAvailable, setNewSeatAvailable] = useState(true);

    const fetchAvailableSeats = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/available_seats/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAvailableSeats(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const getCsrfTokenFromServer = async () => {
        try {
            await fetch('http://127.0.0.1:8000/api/set_csrf_token/', {
                method: 'GET',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Error setting CSRF token:', error);
        }
    };

    const addAvailableSeat = async () => {
        try {
            const csrfToken = getCsrfToken();
            const response = await fetch('http://127.0.0.1:8000/api/handle_request/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'add_seat',
                    seat_number: newSeatNumber,
                    movie_screening_id: newMovieScreeningId,
                    available: newSeatAvailable,
                }),
            });
            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`);
            }
            const newSeat = await response.json();
            setAvailableSeats([...availableSeats, newSeat]);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchAvailableSeats();
        getCsrfTokenFromServer();
    }, []);

    return (
        <div className="AboutUs">
            <div id="header_container">
                <Header />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Seat Number"
                    value={newSeatNumber}
                    onChange={(e) => setNewSeatNumber(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Movie Screening ID"
                    value={newMovieScreeningId}
                    onChange={(e) => setNewMovieScreeningId(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={newSeatAvailable}
                        onChange={(e) => setNewSeatAvailable(e.target.checked)}
                    />
                    Available
                </label>
                <button onClick={addAvailableSeat}>Add Available Seat</button>
            </div>
            <div>
                <button onClick={fetchAvailableSeats}>Load Available Seats</button>
                {error && <p>Error: {error}</p>}
                <div>
                    {availableSeats.length > 0 ? (
                        <ul>
                            {availableSeats.map((seat) => (
                                <li key={seat.id}>
                                    <h2>Seat number: {seat.seat_number}</h2>
                                    <h2>Movie screening ID: {seat.movie_screening_id}</h2>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No available seats loaded</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AboutUs;

