import React, {useContext} from "react";
import "./styles/Tickets.css";
import {AuthContext} from "../contexts/AuthContext.jsx";
import axios from "axios";

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

function Tickets() {
    const {state} = useContext(AuthContext);
    const tickets = state.tickets;

    const handleReservation = async (ticketId, status) => {
        try {
            const response = await client.put('/handle_reservation/', {
                ticketid: ticketId,
                status: status
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`);
            }

            const result = await response.json();
            console.log(result.message);

            setTickets(tickets.map(ticket => ticket.ticket_id === ticketId ? {...ticket, status} : ticket));
            setNotification("Ticket status has been changed successfully");
            setIsSuccess(true);
            setIsModalOpen(true);
        } catch (error) {
            console.error(error.message);
            setError("Some problems occurred during changing the status. Please, try again later");
            setIsSuccess(false);
            setIsModalOpen(true);
        }
    };

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
                                    <p><strong>Ordered On:</strong> {ticket.ordered_on_date} at {ticket.ordered_on_time}
                                    </p>
                                </div>
                                {ticket.status.trim() === 'New' && (
                                    <div className="ticket-actions">
                                        <button onClick={() => handleReservation(ticket.ticket_id, 'Confirmed')}
                                                className="buy-btn">Buy reserved seat
                                        </button>
                                        <button onClick={() => handleReservation(ticket.ticket_id, 'Canceled')}
                                                className="cancel-btn">Cancel reservation
                                        </button>
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