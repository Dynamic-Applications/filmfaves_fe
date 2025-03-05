import React, { useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";

export default function IdleTimerContainer() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const onIdle = () => {
        console.log("User is idle");
        setOpenModal(true); // Show modal when user goes idle
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setOpenModal(false);
        console.log("User has been logged out");
    };

    const handleStaySignedIn = () => {
        reset(); // Reset the idle timer
        setOpenModal(false);
        console.log("User chose to stay signed in");
    };

    // Use the `useIdleTimer` hook
    const { reset } = useIdleTimer({
        timeout: 5 * 1000, // 5 seconds
        onIdle,
        debounce: 500,
    });

    return (
        <div>
            <h2>{isLoggedIn ? "User is Active" : "User is Logged Out"}</h2>

            {/* MUI Dialog for Idle Warning */}
            <Dialog open={openModal} onClose={handleStaySignedIn}>
                <DialogTitle>Idle Warning</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You have been idle for a while. Do you want to log out?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleStaySignedIn} color="primary">
                        Stay Signed In
                    </Button>
                    <Button onClick={handleLogout} color="secondary">
                        Log Out
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
