


// const API_URL = process.env.REACT_APP_FILMFAVES_API;

// export const handleLogout = async (setIsLoggedIn, navigate) => {
//     try {
//         const response = await fetch(`${API_URL}/auth/logout` || "http://localhost:4000/auth/logout", {
//             method: "GET",
//             credentials: "include", // Include cookies in the request
//         });

//         const data = await response.json();

//         if (response.ok) {
//             alert(data.message); // Display success message
//             localStorage.removeItem("token"); // Remove token from localStorage
//             setIsLoggedIn(false); // Update state to reflect logged-out status
//             navigate("/"); // Redirect to the homepage
//         } else {
//             console.error(
//                 "Failed to log out:",
//                 data.message || "Unknown error."
//             );
//         }
//     } catch (error) {
//         console.error("Error during logout:", error.message);
//     }
// };


import React, { useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";

export default function Logout() {
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("User has been logged out due to inactivity.");
        setOpenModal(false);
        // Clear auth token or user session
        localStorage.removeItem("token"); // Adjust based on your auth logic
        navigate("/signin"); // Redirect to sign-in page
    };

    const handleStaySignedIn = () => {
        reset(); // Reset the idle timer
        setOpenModal(false);
        console.log("User chose to stay signed in.");
    };

    const onIdle = () => {
        console.log("User is idle. Showing logout prompt.");
        setOpenModal(true);
    };

    // Set up the idle timer
    const { reset } = useIdleTimer({
        timeout: 5 * 1000, // Auto logout warning after 5 seconds of inactivity
        onIdle,
        debounce: 500,
    });

    return (
        <div>
            <h2>Welcome! You are logged in.</h2>

            {/* Logout confirmation modal */}
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
