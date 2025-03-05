import React, { useState, useEffect } from "react";
import { MenuItems } from "../menu/Menu";
import "./NavBar.css";
import Logo from "../../assets/light.jpg";
import { Link, useNavigate } from "react-router-dom";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    Menu,
    MenuItem,
    useMediaQuery,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import { useIdleTimer } from "react-idle-timer"; // Importing the idle timer

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openModal, setOpenModal] = useState(false); // Modal state for idle timeout
    const [logoutTimeout, setLogoutTimeout] = useState(null); // Timeout ID for auto logout
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // Checking if the user is logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/signin");
        handleMenuClose();
        setOpenModal(false); // Close the modal after logging out
        clearTimeout(logoutTimeout); // Clear any remaining logout timeout
    };

    // Idle timer handler
    const onIdle = () => {
        if (!isLoggedIn) return; // Don't show modal if not logged in
        console.log("User is idle");
        setOpenModal(true); // Show the modal when idle

        // Set a timeout for auto logout after another 5 seconds if the modal is not interacted with
        const timeoutId = setTimeout(() => {
            handleLogout(); // Log the user out if no action is taken in the modal
        }, 5 * 60 * 1000); 

        setLogoutTimeout(timeoutId); // Save the timeout ID to clear it later
    };

    // Modal actions
    const handleStaySignedIn = () => {
        reset(); // Reset idle timer
        setOpenModal(false); // Close modal
        clearTimeout(logoutTimeout); // Clear the auto-logout timeout
    };

    const handleLogoutFromModal = () => {
        handleLogout(); // Log the user out
    };

    // Set up idle timer with a timeout of 5 minutes
    const { reset } = useIdleTimer({
        timeout: 5 * 60 * 1000,
        onIdle, // Call onIdle function when idle
        debounce: 500,
    });

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Mobile View */}
                {isMobile ? (
                    <>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start", // Align to the left
                            }}
                        >
                            <img
                                className="my-img"
                                src="/assets/light.jpg"
                                alt="Logo"
                                style={{ height: 40, marginRight: 8 }}
                            />
                            <Typography variant="h6" sx={{ color: "white" }}>
                                <Link
                                    to="/movies"
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    FilmFaves
                                </Link>
                            </Typography>
                        </Box>
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMenuClick}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {MenuItems.map((item, index) => (
                                <MenuItem key={index} onClick={handleMenuClose}>
                                    <Link
                                        to={item.url}
                                        style={{
                                            textDecoration: "none",
                                            color: "inherit",
                                        }}
                                    >
                                        {item.title}
                                    </Link>
                                </MenuItem>
                            ))}
                            {isLoggedIn ? (
                                <MenuItem onClick={handleLogout}>
                                    Logout
                                </MenuItem>
                            ) : (
                                <MenuItem onClick={handleMenuClose}>
                                    <Link
                                        to="/signin"
                                        style={{
                                            textDecoration: "none",
                                            color: "inherit",
                                        }}
                                    >
                                        Login
                                    </Link>
                                </MenuItem>
                            )}
                        </Menu>
                    </>
                ) : (
                    <>
                        {/* Desktop View */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start", // Align to the left
                                flexGrow: 1,
                            }}
                        >
                            <Link
                                to="/movies"
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <img
                                    className="my-img"
                                    src={Logo}
                                    alt="Logo"
                                    style={{ height: 40, marginRight: 8 }}
                                />
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                    FilmFaves
                                </Typography>
                            </Link>
                        </Box>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            {MenuItems.map((item, index) => (
                                <Button
                                    key={index}
                                    color="inherit"
                                    component={Link}
                                    to={item.url}
                                >
                                    {item.title}
                                </Button>
                            ))}
                            {isLoggedIn ? (
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            ) : (
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/signin"
                                >
                                    Login
                                </Button>
                            )}
                        </Box>
                    </>
                )}
            </Toolbar>

            {/* Idle timeout modal */}
            <Dialog open={openModal} onClose={handleStaySignedIn}>
                <DialogTitle>Idle Timeout Warning</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You will be signed out in 5 minutes. Would you like to
                        stay signed in or log out?
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    sx={{
                        display: "flex",
                        justifyContent: "center", // Center the buttons
                        gap: 3, // Space between the buttons
                    }}
                >
                    <Button
                        onClick={handleStaySignedIn}
                        sx={{
                            backgroundColor: "green",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "darkgreen",
                            },
                            marginBottom: "10px", // Add margin at the bottom
                        }}
                    >
                        Stay Signed In
                    </Button>
                    <Button
                        onClick={handleLogoutFromModal}
                        sx={{
                            backgroundColor: "red",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "darkred",
                            },
                            marginBottom: "10px", // Add margin at the bottom
                        }}
                    >
                        Log Out
                    </Button>
                </DialogActions>
            </Dialog>
        </AppBar>
    );
};

export default Navbar;
