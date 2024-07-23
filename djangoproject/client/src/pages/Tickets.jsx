// Tickets.jsx
import React from "react";
import "./styles/Tickets.css";

function Tickets({ tickets, handleReservation }) {
    return (
        <div id="tickets" className="section tickets">
            {tickets && tickets.length > 0 ? (
                <ul className="ticket-list">
                    {tickets.map(ticket => (
                        <li key={ticket.ticket_id} className="ticket-card">
                            <div className="ticket-container">
                                <div id="ticket-title">
                                    <h3>{ticket.title}</h3>
                                </div>
                                <div className="ticket-info">
                                    <p><strong>Date: </strong>{ticket.date}</p>
                                    <p><strong>Start Time: </strong>{ticket.start_time}</p>
                                    <p><strong>Duration: </strong>{ticket.duration} minutes</p>
                                    <p><strong>Hall Number: </strong>{ticket.hall_number}</p>
                                    <p><strong>Seat Number: </strong>{ticket.sit_number}</p>
                                </div>
                                <div className="ticket-info">
                                    <p><strong>Price:</strong> {ticket.price}</p>
                                    <p><strong>Status:</strong> {ticket.status}</p>
                                    <p><strong>Ordered On:</strong> {ticket.ordered_on_date} at {ticket.ordered_on_time}</p>
                                </div>
                                {ticket.status.trim() === 'New' && (
                                    <div className="ticket-actions">
                                        <button onClick={() => handleReservation(ticket.ticket_id, 'Confirmed')} className="buy-btn">Buy reserved seat</button>
                                        <button onClick={() => handleReservation(ticket.ticket_id, 'Canceled')} className="cancel-btn">Cancel reservation</button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You currently have no tickets.</p>
            )}
        </div>
    );
}

export default Tickets;