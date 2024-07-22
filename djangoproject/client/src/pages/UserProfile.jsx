import React, { useState } from "react";
import "./styles/UserProfile.css";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal"; // Імпорт модального вікна

function UserProfile({ tickets, setTickets, username }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [activeTab, setActiveTab] = useState("tickets");
    const [notification, setNotification] = useState("");
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(true);
    const navigate = useNavigate();

    const toggleShowCurrentPassword = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const handleReservation = async (ticketId, status) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/handle_reservation/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticketid: ticketId,
                    status: status,
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`);
            }

            const result = await response.json();
            console.log(result.message);

            setTickets(tickets.map(ticket => ticket.ticket_id === ticketId ? { ...ticket, status } : ticket));
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

    const closeModal = () => {
        setIsModalOpen(false);
        setNotification("");
        setError("");
    };

    const renderContent = () => {
        if (activeTab === "tickets") {
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
        } else if (activeTab === "profile") {
            return (
                <div className="section settings">
                    <form>
                        <h3>Change Password</h3>
                        <hr className="underline" />
                        <div className="input-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={toggleShowCurrentPassword}
                                className="show-hide-btn"
                            >
                                {showCurrentPassword ? "HIDE" : "SHOW"}
                            </button>
                        </div>
                        <div className="input-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={toggleShowNewPassword}
                                className="show-hide-btn"
                            >
                                {showNewPassword ? "HIDE" : "SHOW"}
                            </button>
                        </div>
                        <div className="password-requirements-container">
                            <p className="password-requirements">
                                Password must be at least 8 characters long and include at least 3 of the following:
                                uppercase letter, lowercase letter, number, special character.
                            </p>
                        </div>
                        <div id="change-password-btn-container">
                            <button type="submit" className="change-password-btn">
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>
            );
        }
    };

    return (
        <div className="UserProfile">
            <div className="welcome-section">
                <h1>Welcome, {username}!</h1>
                <p>We're glad to have you back.</p>
            </div>
            <div id="content">
                <div id="tab-buttons">
                    <button className={activeTab === "tickets" ? "active" : ""} onClick={() => setActiveTab("tickets")}>
                        My tickets
                    </button>
                    <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
                        My profile
                    </button>
                </div>
                {isModalOpen && (
                    <Modal
                        message={notification || error}
                        onClose={closeModal}
                        isSuccess={isSuccess}
                    />
                )}
                {renderContent()}
            </div>
        </div>
    );
}

export default UserProfile;