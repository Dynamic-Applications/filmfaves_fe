// 

import React, { useState, useEffect } from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { handleLogout } from "./LogOut";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Home from "./Home";

export default function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate(); // Get navigate function here

    // Check localStorage for token to set initial login state
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Update state based on token presence
    }, []);

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
                        <Button
                            color="inherit"
                            onClick={() =>
                                handleLogout(setIsLoggedIn, navigate)
                            }
                        >
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
