import React, {useState, useEffect} from "react";
import axios from 'axios';
import "./styles/UserProfile.css";

const Modal = ({message, onClose}) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <p>{message}</p>
                <button onClick={onClose} className="close-btn">Close</button>
            </div>
        </div>
    );
};

function UserProfile({isLogin, username, setUsername}) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [activeTab, setActiveTab] = useState("tickets");
    const [notification, setNotification] = useState("");
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleShowCurrentPassword = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const specific_userID = 6;

    useEffect(() => {

    });

    useEffect(() => {
        const getUsername = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user', {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setUsername('Newcomer');
                        console.error('Username: You are not logged in');
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                } else {
                    const content = await response.json();
                    console.log('Content:', content);
                    setUsername(content.username);
                    console.log('User profile:', content.username);
                }
            } catch (error) {
                setUsername('Newcomer');
                console.error('Failed to fetch user data:', error);
            }
        }

        getUsername();
        const fetchTickets = async () => {
            try {
                const ticketsResponse = await axios.get(`http://127.0.0.1:8000/user/${specific_userID}/tickets`);
                if (isLogin) {
                    setTickets(ticketsResponse.data);
                } else {
                    console.log('Tickets error: You are not logged in.');
                }
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };
        fetchTickets();
    }, [specific_userID]);


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

            // Update tickets state
            setTickets(tickets.map(ticket => ticket.ticket_id === ticketId ? {...ticket, status} : ticket));
            setNotification("Ticket status updated successfully!");
            setIsModalOpen(true);
        } catch (error) {
            console.error(error.message);
            setError("An error occurred while updating the ticket status.");
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
                                            <p><strong>Ordered
                                                On:</strong> {ticket.ordered_on_date} at {ticket.ordered_on_time}</p>
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
        } else if (activeTab === "profile") {
            return (
                <div className="section settings">
                    <form>
                        <h3>Change Password</h3>
                        <hr className="underline"/>
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
                                uppercase
                                letter, lowercase letter, number, special character.
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
                    <button
                        className={activeTab === "tickets" ? "active" : ""}
                        onClick={() => setActiveTab("tickets")}
                    >
                        My tickets
                    </button>
                    <button
                        className={activeTab === "profile" ? "active" : ""}
                        onClick={() => setActiveTab("profile")}
                    >
                        My profile
                    </button>
                </div>
                {isModalOpen && (
                    <Modal
                        message={notification || error}
                        onClose={closeModal}
                    />
                )}
                {renderContent()}
            </div>
        </div>
    );
}

export default UserProfile;
