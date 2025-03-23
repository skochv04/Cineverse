import React, { useState, useEffect, useContext } from "react";
import "./styles/Showtime.css";
import { useParams } from "react-router-dom";
import Loading from "./Loading.jsx";
import Modal from "./Modal";
import { handleServerError } from "../utils/errorHandler.js";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { format } from 'date-fns';
import axios from "axios";

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

function Showtime() {
    const { state } = useContext(AuthContext);
    const username = state.username;
    const { moviescreeningID } = useParams();
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [showtime, setShowtime] = useState(null);
    const [message, setMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(true);
    const [seatType, setSeatType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchShowtime = async () => {
            try {
                const response = await client.get(`/showtime/${moviescreeningID}/`);
                const data = response.data;
                setShowtime(data);
            } catch (error) {
                console.error('Error fetching Showtime:', error);
                setMessage(error.message);
                setIsSuccess(false);
                setIsModalOpen(true);
            }
        };

        const fetchOccupiedSeats = async () => {
            try {
                const response = await client.get(`/api/occupied_seats/${moviescreeningID}/`);
                const data = response.data;
                setOccupiedSeats(data);
            } catch (error) {
                console.error('Error fetching occupied seats:', error);
                setMessage(error.message);
                setIsSuccess(false);
                setIsModalOpen(true);
            }
        };

        fetchShowtime();
        fetchOccupiedSeats();
    }, [moviescreeningID]);

    const fetchOccupiedSeats = async () => {
        try {
            const response = await client.get(`/api/occupied_seats/${moviescreeningID}/`);
            const data = await response.data;
            setOccupiedSeats(data);
        } catch (error) {
            console.error('Error fetching occupied seats:', error);
            setMessage(error.message);
            setIsSuccess(false);
            setIsModalOpen(true);
        }
    };

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
    const reserveSeat = async (newSeatNumber, newMovieScreeningId) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/handle_request/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'reserve_seat',
                    seat_number: newSeatNumber,
                    movie_screening_id: newMovieScreeningId,
                    available: false,
                    username: username,
                }),
            });
            await handleServerError(response);
            setMessage('Seat reserved successfully!');
            setIsSuccess(true);
            setIsModalOpen(true);
            await fetchOccupiedSeats();
        } catch (error) {
            setMessage(error.message);
            setIsSuccess(false);
            setIsModalOpen(true);
            await fetchOccupiedSeats();
        }
    };

    const buySeat = async (newSeatNumber, newMovieScreeningId) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/handle_request/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'buy_seat',
                    seat_number: newSeatNumber,
                    movie_screening_id: newMovieScreeningId,
                    available: false,
                    username: username,
                }),
            });
            await handleServerError(response);
            setMessage('Seat purchased successfully!');
            setIsSuccess(true);
            setIsModalOpen(true);
            await fetchOccupiedSeats();
        } catch (error) {
            setMessage(error.message);
            setIsSuccess(false);
            setIsModalOpen(true);
            await fetchOccupiedSeats();
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

    const closeModal = () => {
        setIsModalOpen(false);
        setMessage(null);
    };

    const formatDateTime = (dateStr, timeStr) => {
        const dateTimeStr = `${dateStr} ${timeStr}`;
        const dateTime = new Date(dateTimeStr);
        return format(dateTime, 'dd MMMM yyyy, h:mm:ss a');
    };

    if (!showtime) {
        return <div><Loading /></div>;
    }

    return (
        <div className="Showtime">
            <div id="showtime-info">
                <h2><span>{formatDateTime(showtime.date, showtime.starttime)}</span></h2>
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
                                {row.map((seat) => (
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
                        {message && (
                            <Modal
                                message={message}
                                onClose={closeModal}
                                isSuccess={isSuccess}
                            />
                        )} {/* Використовуємо компонент Modal */}
                        <div id="button-container">
                            <div>
                                <button
                                    id="button2"
                                    onClick={() => buySeat(convertSeatToId(selectedSeat), moviescreeningID)}
                                    className="primary-button"
                                    disabled={!selectedSeat || isSeatOccupied(selectedSeat)}
                                >
                                    Buy seat
                                </button>
                            </div>
                            <div>
                                <button
                                    id="button1"
                                    onClick={() => reserveSeat(convertSeatToId(selectedSeat), moviescreeningID)}
                                    className="simple-button"
                                    disabled={!selectedSeat || isSeatOccupied(selectedSeat)}
                                >
                                    Reserve seat
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