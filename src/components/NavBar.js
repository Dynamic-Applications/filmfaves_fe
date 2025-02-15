import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Home from "./Home";

const API_URL = process.env.REACT_APP_FILMFAVES_API;

export default function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Check localStorage for token to set initial login state
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Update state based on token presence
    }, []);

    // Handle Logout
    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: "GET",
                credentials: "include", // Include cookies in the request
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message); // Display success message
                localStorage.removeItem("token"); // Remove token from localStorage
                setIsLoggedIn(false); // Update state to reflect logged-out status
                navigate("/"); // Redirect to the homepage
            } else {
                console.error(
                    "Failed to log out:",
                    data.message || "Unknown error."
                );
            }
        } catch (error) {
            console.error("Error during logout:", error.message);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        fontFamily="monospace"
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        FilmFaves
                    </Typography>
                    {isLoggedIn ? (
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : (
                        <Button color="inherit">
                            <Link
                                to="/SignIn"
                                style={{
                                    textDecoration: "none",
                                    color: "white",
                                }}
                            >
                                Login
                            </Link>
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/SignIn"
                    element={<SignIn onLogin={() => setIsLoggedIn(true)} />}
                />
                <Route path="/SignUp" element={<SignUp />} />
            </Routes>
        </Box>
    );
}
