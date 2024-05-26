import React, { useState, useEffect } from "react";
import axios from 'axios';
import Header from "./Header.jsx";
import "./styles/UserProfile.css";

function UserProfile() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [activeTab, setActiveTab] = useState("tickets");

    const toggleShowCurrentPassword = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const specific_userID = 6;

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const ticketsResponse = await axios.get(`http://127.0.0.1:8000/user/${specific_userID}/tickets`);
                setTickets(ticketsResponse.data);
            } catch (error) {
                console.error('Error fetching Showtime:', error);
            }
        };
        fetchTickets();
    }, [specific_userID]);

    const handleTabClick = (tab) => {
        if (tab !== activeTab && !animating) {
            setAnimating(true);
            setTimeout(() => {
                setActiveTab(tab);
                setAnimating(false);
            }, 500); // Match this duration with the CSS transition duration
        }
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
                                        <div className="ticket-info">
                                            <p><strong>Movie:</strong> {ticket.title}</p>
                                            <p><strong>Date:</strong> {ticket.date}</p>
                                            <p><strong>Start Time:</strong> {ticket.start_time}</p>
                                            <p><strong>Duration:</strong> {ticket.duration} minutes</p>
                                            <p><strong>Hall Number:</strong> {ticket.hall_number}</p>
                                            <p><strong>Seat Number:</strong> {ticket.sit_number}</p>
                                        </div>
                                        <div className="ticket-info">
                                            <p><strong>Price:</strong> {ticket.price}</p>
                                            <p><strong>Status:</strong> {ticket.status}</p>
                                            <p><strong>Ordered
                                                On:</strong> {ticket.ordered_on_date} at {ticket.ordered_on_time}</p>
                                        </div>
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
                        <p className="password-requirements">
                            Password must be at least 8 characters long and include at least 3 of the following:
                            uppercase
                            letter, lowercase letter, number, special character.
                        </p>
                        <button type="submit" className="change-password-btn">
                            Change Password
                        </button>
                    </form>
                </div>
            );
        }
    };

    return (
        <div className="UserProfile">
            <div id="header_container">
                <Header />
            </div>
            <div className="welcome-section">
                <h1>Welcome, [Username]!</h1>
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
                {renderContent()}
            </div>
        </div>
    );
}

export default UserProfile;