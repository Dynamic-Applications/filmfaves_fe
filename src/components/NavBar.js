import React, { useState, useEffect } from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";


const handleLogout = (setIsLoggedIn, navigate) => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/signin");
};

export default function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
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
                                to="/signin"
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
        </Box>
    );
}
