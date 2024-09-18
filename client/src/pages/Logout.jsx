import React, {useContext} from 'react';
import ModalConfirmation from './ModalConfirmation';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import {AuthContext} from "../contexts/AuthContext.jsx";

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

function Logout({open, setLogoutModalOpen}) {
    const {dispatch} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogoutConfirm = async () => {
        try {
            const response = await client.post("/api/logout/", {withCredentials: true});
            if (response.status === 200) {
                dispatch({type: 'LOGOUT'});
                setLogoutModalOpen(false);
                navigate('/login');
            } else {
                console.error("Logout error:", response);
            }
        } catch (error) {
            console.error("There was an error logging out:", error);
        }
    };

    const handleClose = () => {
        setLogoutModalOpen(false);
    };

    return (
        <>
            {open && (
                <ModalConfirmation
                    message="Are you sure you want to log out?"
                    onClose={handleClose}
                    onConfirm={handleLogoutConfirm}
                    confirmText="Logout"
                    closeText="Cancel"
                />
            )}
        </>
    );
}

export default Logout;