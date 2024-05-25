import React, { useState, useEffect } from "react";
import { getCsrfToken } from '../utils/csrf';
import Header from "./Header.jsx";
import "./styles/Admin.css";

function Admin() {
    const [availableSeats, setAvailableSeats] = useState([]);
    const [error, setError] = useState(null);
    const [newSeatNumber, setNewSeatNumber] = useState('');
    const [newMovieScreeningId, setNewMovieScreeningId] = useState('');
    const [newSeatAvailable, setNewSeatAvailable] = useState(true);
    const [newCustomerID, setNewCustomerID] = useState('');
    const [newOrderOnDate, setNewOrderOnDate] = useState('');
    const [newOrderOnTime, setNewOrderOnTime] = useState('');
    const [newStatus, setNewStatus] = useState('');

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

    return (
        <div className="Admin">
            <div id="header_container">
                <Header />
            </div>
            <div id="content">
                <div id="ticket-container">
                    <h2>Tickets</h2>
                    <h3>Add</h3>
                    <input
                        type="number"
                        placeholder="CustomerID"
                        value={newCustomerID}
                        onChange={(e) => setNewCustomerID(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="OrderOnDate"
                        value={newOrderOnDate}
                        onChange={(e) => setNewOrderOnDate(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="OrderOnTime"
                        value={newOrderOnTime}
                        onChange={(e) => setNewOrderOnTime(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Status"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Movie Screening ID"
                        value={newMovieScreeningId}
                        onChange={(e) => setNewMovieScreeningId(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="SeatNumber"
                        value={newSeatNumber}
                        onChange={(e) => setNewSeatNumber(e.target.value)}
                    />
                    <button onClick={addAvailableSeat}>Add Available Seat</button>
                </div>
            </div>
        </div>
    );
}

export default Admin;