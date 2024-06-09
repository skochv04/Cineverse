import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import "./styles/Showtime.css";
import { getCsrfToken } from "../utils/csrf.js";
import { useParams } from "react-router-dom";
import Loading from "./Loading.jsx";
import ErrorMessage from "./ErrorMessage";  // Importujemy nowy komponent
import { handleServerError } from "../utils/errorHandler.js";  // Importujemy funkcję obsługi błędów

function Showtime() {
    const { moviescreeningID } = useParams();
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [showtime, setShowtime] = useState(null);
    const [error, setError] = useState(null);
    const [seatType, setSeatType] = useState('');

    useEffect(() => {
        const fetchShowtime = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/showtime/${moviescreeningID}`);
                await handleServerError(response);
                const data = await response.json();
                console.log("Showtime data:", data); // Debugging log
                setShowtime(data);
            } catch (error) {
                console.error('Error fetching Showtime:', error);
                setError(error.message);
            }
        };

        const fetchOccupiedSeats = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/occupied_seats/${moviescreeningID}`);
                await handleServerError(response);
                const data = await response.json();
                console.log("Occupied seats data:", data); // Debugging log
                setOccupiedSeats(data);
            } catch (error) {
                console.error('Error fetching occupied seats:', error);
                setError(error.message);
            }
        };

        fetchShowtime();
        fetchOccupiedSeats();
    }, [moviescreeningID]);

    const handleSelectSeat = (seat) => {
        setSelectedSeat(seat);
        if (seat.startsWith('A')) {
            setSeatType('Premium');
        } else {
            setSeatType('Standard');
        }
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
        let seatsInRow = 6;

        for (let rowIndex = 8; rowIndex >= 0; rowIndex--) {
            const row = [];
            for (let seatIndex = 1; seatIndex <= seatsInRow; seatIndex++) {
                row.push(`${String.fromCharCode(65 + rowIndex)}${seatIndex}`);
            }
            rows.push(row);
            if (rowIndex > 3) {
                seatsInRow += 1;
            }
        }
        return rows;
    };

    const seats = generateSeats();

    //     const generateSeats = () => {
    //         const rows = [];
    //         let seatsInRow = 6;
    //
    //         for (let rowIndex = 9; rowIndex >= 0; rowIndex--) {
    //             const row = [];
    //             for (let seatIndex = 1; seatIndex <= seatsInRow; seatIndex++) {
    //                 row.push(`${String.fromCharCode(65 + rowIndex)}${seatIndex}`);
    //             }
    //             rows.push(row);
    //             if (rowIndex >= 3) {
    //                 seatsInRow += 1;
    //             }
    //         }
    //         return rows;
    //     };

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
            await handleServerError(response);
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
            await handleServerError(response);
        } catch (error) {
            setError(error.message);
        }
    };

    const getSeatPrice = () => {
        if (showtime) {
            if (seatType === 'Premium') {
                return showtime.pricepremium;
            } else if (seatType === 'Standard') {
                return showtime.pricestandard;
            }
        }
        return null;
    };

    if (!showtime) {
        return <div><Loading/></div>;
    }

    return (
        <div className="Showtime">
            <div id="header_container">
                <Header />
            </div>
            <div id="showtime-info">
                <h2>Chosen Date: {showtime.date} at {showtime.starttime}</h2>
            </div>
            <div id="content">
                <div id="seating-chart-container">
                    <div className="seating-chart">
                        <div className="cinema-screen">
                            <div className="screen-container">
                                <svg className="screen-svg" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: "whitesmoke", stopOpacity: 1 }} />
                                            <stop offset="10%" style={{ stopColor: "whitesmoke", stopOpacity: 0.5 }} />
                                            <stop offset="20%" style={{ stopColor: 'whitesmoke', stopOpacity: 0.4 }} />
                                            <stop offset="40%" style={{ stopColor: 'whitesmoke', stopOpacity: 0.3 }} />
                                            <stop offset="60%" style={{ stopColor: 'whitesmoke', stopOpacity: 0.2 }} />
                                            <stop offset="80%" style={{ stopColor: 'whitesmoke', stopOpacity: 0.1 }} />
                                            <stop offset="100%" style={{ stopColor: 'whitesmoke', stopOpacity: 0 }} />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,4 Q50,0 100,4 L96,15 L4,15 Z" fill="url(#gradient)" />
                                    <path d="M0,4 Q50,0 100,4" stroke="white" fill="none" strokeWidth="1" />
                                </svg>
                            </div>
                        </div>
                        {seats.map((row, rowIndex) => (
                            <div
                                key={rowIndex}
                                className="seat-row"
                                style={{ justifyContent: rowIndex > 3 ? 'center' : 'start' }}
                            >
                                {row.map((seat, seatIndex) => (
                                    <div
                                        key={seat}
                                        className={`seat ${isSeatOccupied(seat)
                                            ? 'non-availableSeat'
                                            : rowIndex === 8
                                                ? 'availableSeatPremium'
                                                : 'availableSeat'
                                        } ${selectedSeat === seat ? 'selected' : ''}`}
                                        onClick={() =>
                                            !isSeatOccupied(seat) && handleSelectSeat(seat)
                                        }
                                    >
                                        {seat}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div id="summary_container">
                        <div id="title_container">
                            <div id="title_details">
                                <div id="your_seat"><h5>Your seat: </h5>{selectedSeat}</div>
                                <div id="seat_type"><h5>Type of seat: </h5>{seatType}</div>
                                <div id="price"><h5>Price: </h5>{getSeatPrice()}</div>
                            </div>
                        </div>
                        {error && <ErrorMessage message={error} clearError={() => setError(null)} />}  {/* Używamy komponentu ErrorMessage */}
                        <div id="button-container">
                            <div>
                                <button
                                    id="button1"
                                    onClick={() => reserveSeat(convertSeatToId(selectedSeat), moviescreeningID)}
                                    className="proceed-button"
                                    disabled={!selectedSeat || isSeatOccupied(selectedSeat)}
                                >
                                    Reserve seat
                                </button>
                            </div>
                            <div>
                                <button
                                    id="button2"
                                    onClick={() => buySeat(convertSeatToId(selectedSeat), moviescreeningID)}
                                    className="proceed-button"
                                    disabled={!selectedSeat || isSeatOccupied(selectedSeat)}
                                >
                                    Buy seat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Showtime;
