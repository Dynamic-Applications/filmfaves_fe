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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
    };

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
        </AppBar>
    );
};

export default Navbar;
