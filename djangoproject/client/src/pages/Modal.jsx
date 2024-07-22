import React from "react";
import "./styles/Modal.css";
import successIcon from "../assets/success.png";
import failIcon from "../assets/fail.png";

const Modal = ({ message, onClose, isSuccess }) => {
    return (
        <div className="modal-overlay">
            <div className={`modal`}>
                <img src={isSuccess ? successIcon : failIcon} alt={isSuccess ? "Success" : "Fail"} className="status-icon" />
                <div className="modal-content">
                    <p className="modal-title">{isSuccess ? 'Congratulations!' : 'Something went wrong!'}</p>
                    <p className="modal-message">{message}</p>
                </div>
                <div className="close-icon" onClick={onClose}>✕</div>
            </div>
        </div>
    );
};

export default Modal;