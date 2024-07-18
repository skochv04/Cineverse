import React from 'react';
import { Button, Box, Typography, Modal, createTheme } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

// Create a dark theme
const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

// Create styled components
const StyledModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const StyledBox = styled(Box)({
    width: 400,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    outline: 'none',
});

const StyledTypography = styled(Typography)({
    marginBottom: theme.spacing(2),
});

const StyledButton = styled(Button)({
    marginRight: theme.spacing(2),
});

function Logout({ open, setIsLogin, setUsername, setLogoutModalOpen }) {
    const handleLogoutConfirm = () => {
        client.post("/api/logout/")
            .then(() => {
                setIsLogin(false);
                setUsername('Newcomer');
                setLogoutModalOpen(false);
                console.log("Logout successful");
            })
            .catch(error => {
                console.error("There was an error logging out:", error);
            });
    };

    const handleClose = () => {
        setLogoutModalOpen(false);
    };

    return (
        <StyledModal
            open={open}
            onClose={handleClose}
            aria-labelledby="logout-modal-title"
            aria-describedby="logout-modal-description"
        >
            <StyledBox>
                <StyledTypography variant="h6" component="h2" id="logout-modal-title">
                    Confirm Logout
                </StyledTypography>
                <Typography id="logout-modal-description">
                    Are you sure you want to logout?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <StyledButton variant="outlined" onClick={handleClose}>
                        Cancel
                    </StyledButton>
                    <Button variant="contained" onClick={handleLogoutConfirm}>
                        Logout
                    </Button>
                </Box>
            </StyledBox>
        </StyledModal>
    );
}

export default Logout;


