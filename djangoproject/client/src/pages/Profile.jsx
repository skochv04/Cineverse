// Profile.jsx
import React, { useState } from "react";
import "./styles/Profile.css";

function Profile({ username, currentPassword, setCurrentPassword, newPassword, setNewPassword, showCurrentPassword, toggleShowCurrentPassword, showNewPassword, toggleShowNewPassword }) {
    return (
        <div className="Profile">
            <div className="section settings">
                <div className="welcome-section">
                    <h1>Welcome, {username}!</h1>
                    <p>We're glad to have you back.</p>
                </div>
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
        </div>
    );
}

export default Profile;