import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import "./styles/Stage.css";
import { getCsrfToken } from "../utils/csrf.js";

function Stage() {
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOccupiedSeats = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/occupied_seats/');
                const data = await response.json();
                setOccupiedSeats(data);
            } catch (error) {
                console.error('Error fetching occupied seats:', error);
            }
        };
        fetchOccupiedSeats();
    }, []);

    const handleSelectSeat = (seat) => {
        setSelectedSeat(seat);
    };

    const convertSeatToId = (seat) => {
        const row = seat.charCodeAt(0) - 65;
        const seatNumber = parseInt(seat.substring(1), 10);
        let seatsBeforeRow = 0;

        for (let i = 0; i < row; i++) {
            seatsBeforeRow += (i < 4 ? 11 : 10 - i + 4);
        }
        return seatsBeforeRow + seatNumber;
    };

    const isSeatOccupied = (seat) => {
        const seatId = convertSeatToId(seat);
        return occupiedSeats.some(seatObj => seatObj.seat_number === seatId);
    };

    const generateSeats = () => {
        const rows = [];
        let seatsInRow = 11;

        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            const row = [];
            for (let seatIndex = 1; seatIndex <= seatsInRow; seatIndex++) {
                row.push(`${String.fromCharCode(65 + rowIndex)}${seatIndex}`);
            }
            rows.push(row);
            if (rowIndex >= 3) {
                seatsInRow -= 1;
            }
        }
        return rows;
    };

    const seats = generateSeats();

    const reserveSeat = async (newSeatNumber, newMovieScreeningId) => {
        try {
            const csrfToken = getCsrfToken();
            const response = await fetch('http://127.0.0.1:8000/api/handle_request/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'reserve_seat',
                    seat_number: newSeatNumber,
                    movie_screening_id: newMovieScreeningId,
                    available: false,
                }),
            });
            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const buySeat = async (newSeatNumber, newMovieScreeningId) => {
        try {
            const csrfToken = getCsrfToken();
            const response = await fetch('http://127.0.0.1:8000/api/handle_request/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'buy_seat',
                    seat_number: newSeatNumber,
                    movie_screening_id: newMovieScreeningId,
                    available: false,
                }),
            });
            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="Stage">
            <div id="header_container">
                <Header />
            </div>
            <div id="content">
                <h2>Select Your Seat:</h2>
                <h4>Your seat: {selectedSeat}</h4>
                {error && <p className="error">{error}</p>}
                <div className="seating-chart">
                    {seats.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="seat-row"
                            style={{ justifyContent: rowIndex > 3 ? 'center' : 'start' }}
                        >
                            {row.map((seat) => (
                                <div
                                    key={seat}
                                    className={`seat ${isSeatOccupied(seat) ? 'non-availableSeat' : 'availableSeat'} ${selectedSeat === seat ? 'selected' : ''}`}
                                    onClick={() => !isSeatOccupied(seat) && handleSelectSeat(seat)}
                                >
                                    {seat}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => reserveSeat(convertSeatToId(selectedSeat), 1)}
                    className="proceed-button"
                    disabled={!selectedSeat || isSeatOccupied(selectedSeat)}
                >
                    Reserve seat
                </button>

                <button
                    onClick={() => buySeat(convertSeatToId(selectedSeat), 1)}
                    className="proceed-button"
                    disabled={!selectedSeat || isSeatOccupied(selectedSeat)}
                >
                    Buy seat
                </button>
            </div>
        </div>
    );
}

export default Stage;