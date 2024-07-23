import React from "react";
import "./styles/ModalConfirmation.css";

const ModalConfirmation = ({ message, onClose, onConfirm }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <p>{message}</p>
                <div className="button-container">
                    <button onClick={onClose} className="close-btn">Cancel</button>
                    <button onClick={onConfirm} className="confirm-btn">Logout</button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmation;