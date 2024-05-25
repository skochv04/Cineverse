import React, { useState } from "react";
import Header from "./Header.jsx";
import "./styles/UserProfile.css";

function UserProfile() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
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

      <div className="section tickets">
        <h2>Your Tickets</h2>
        <p>You currently have no tickets.</p>
      </div>

      <div className="section settings">
        <h2>Settings</h2>
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
            Password must be at least 8 characters long and include at least 3 of the following: uppercase
            letter, lowercase letter, number, special character.
          </p>
          <button type="submit" className="change-password-btn">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;