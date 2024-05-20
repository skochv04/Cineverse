import React, { useState } from "react";
import Header from "./Header.jsx";
import "./styles/Stage.css"; // Importing the CSS file for styling

function Stage() {
    const [selectedSeats, setSelectedSeats] = useState([]);

    const handleSelectSeat = (seat) => {
        setSelectedSeats(prevSelectedSeats =>
            prevSelectedSeats.includes(seat)
                ? prevSelectedSeats.filter(s => s !== seat)
                : [...prevSelectedSeats, seat]
        );
    };

    const generateSeats = () => {
        const rows = [];
        let seatsInRow = 15; // Starting number of seats per row

        for (let rowIndex = 0; rowIndex < 11; rowIndex++) {
            const row = [];
            for (let seatIndex = 1; seatIndex <= seatsInRow - 2; seatIndex++) {
                row.push(`${String.fromCharCode(65 + rowIndex)}${seatIndex}`);
            }
            rows.push(row);
            if (rowIndex >= 3) {
                seatsInRow -= 1; // Decrement seats by 2 after the 4th row
            }
            if (rowIndex > 10) {
                break;
            }
        }
        return rows;
    };

    const seats = generateSeats();

    return (
        <div className="Stage">
            <div id="header_container">
                <Header />
            </div>
            <div id="content">
                <h2>Select Your Seats:</h2>
                <div className="seating-chart">
                    {seats.map((row, rowIndex) => (
                        <div key={rowIndex} className="seat-row" style={{ justifyContent: rowIndex > 3 ? 'center' : 'start' }}>
                            {row.map(seat => (
                                <div
                                    key={seat}
                                    className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                                    onClick={() => handleSelectSeat(seat)}
                                >
                                    {seat}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <button className="proceed-button">Proceed to Payment</button>
            </div>
        </div>
    );
}

export default Stage;


// Sprawdzic czy działa jak baza bedzie zwraca wolne miejca:

// import React, { useState, useEffect } from "react";
// import Header from "./Header.jsx";
// import "./styles/Stage.css"; // Importing the CSS file for styling
//
// function Stage() {
//     const [selectedSeats, setSelectedSeats] = useState([]);
//     const [availableSeats, setAvailableSeats] = useState([]);
//
//     useEffect(() => {
//         // Funkcja do pobrania danych o wolnych miejscach z serwera
//         const fetchAvailableSeats = async () => {
//             try {
//                 const response = await fetch('URL_DO_ENDPOINTU');
//                 const data = await response.json();
//                 setAvailableSeats(data); // Załóżmy, że data to tablica z ID wolnych miejsc
//             } catch (error) {
//                 console.error('Błąd podczas pobierania dostępnych miejsc:', error);
//             }
//         };
//
//         fetchAvailableSeats();
//     }, []);
//
//     const handleSelectSeat = (seat) => {
//         setSelectedSeats(prevSelectedSeats =>
//             prevSelectedSeats.includes(seat)
//                 ? prevSelectedSeats.filter(s => s !== seat)
//                 : [...prevSelectedSeats, seat]
//         );
//     };
//
//     const generateSeats = () => {
//         const rows = [];
//         let seatsInRow = 15; // Starting number of seats per row
//
//         for (let rowIndex = 0; rowIndex < 11; rowIndex++) {
//             const row = [];
//             for (let seatIndex = 1; seatIndex <= seatsInRow - 2; seatIndex++) {
//                 row.push(`${String.fromCharCode(65 + rowIndex)}${seatIndex}`);
//             }
//             rows.push(row);
//             if (rowIndex >= 3) {
//                 seatsInRow -= 1; // Decrement seats by 2 after the 4th row
//             }
//             if (rowIndex > 10) {
//                 break;
//             }
//         }
//         return rows;
//     };
//
//     const seats = generateSeats();
//
//     return (
//         <div className="Stage">
//             <div id="header_container">
//                 <Header />
//             </div>
//             <div id="content">
//                 <h2>Select Your Seats:</h2>
//                 <div className="seating-chart">
//                     {seats.map((row, rowIndex) => (
//                         <div key={rowIndex} className="seat-row" style={{ justifyContent: rowIndex > 3 ? 'center' : 'start' }}>
//                             {row.map(seat => (
//                                 <div
//                                     key={seat}
//                                     className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''} ${availableSeats.includes(seat) ? 'available' : 'unavailable'}`}
//                                     onClick={() => availableSeats.includes(seat) && handleSelectSeat(seat)}
//                                 >
//                                     {seat}
//                                 </div>
//                             ))}
//                         </div>
//                     ))}
//                 </div>
//                 <button className="proceed-button">Proceed to Payment</button>
//             </div>
//         </div>
//     );
// }
//
// export default Stage;

