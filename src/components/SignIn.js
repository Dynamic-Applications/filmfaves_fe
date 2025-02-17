import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import moviesimg from "../assets/images/netflix.jpg";
import "./SignIn.css";
import "../App.css";

const API_URL = process.env.REACT_APP_FILMFAVES_API;

export default function SignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${API_URL}/auth/login` || "http://localhost:4000/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to login.");
            }

            // Save the token and redirect
            localStorage.setItem("token", data.token);
            alert(data.message);
            navigate("/movies");
            window.location.reload();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url(${moviesimg})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100vw",
                height: "100vh",
            }}
        >
            <div className="container">
                <div className="text-center m-5-auto">
                    <h2
                        style={{
                            textShadow: "-1px 1px 10px rgba(255,255,255)",
                            fontWeight: "bold",
                        }}
                    >
                        Sign In
                    </h2>
                    <form className="fontColor" onSubmit={handleSubmit}>
                        <p>
                            <label htmlFor="username">
                                Username or Email Address
                            </label>
                            <br />
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </p>
                        <p>
                            <label htmlFor="password">Password</label>
                            <Link to="/forget-password">
                                <label className="right-label">
                                    Forget password?
                                </label>
                            </Link>
                            <br />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </p>
                        {error && (
                            <p style={{ color: "red", fontWeight: "bold" }}>
                                {error}
                            </p>
                        )}
                        <p>
                            <Button
                                color="inherit"
                                id="sub_btn"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </p>
                    </form>
                    <footer>
                        <div className="footers">
                            <p>
                                First time?{" "}
                                <Link
                                    style={{
                                        textDecoration: "none",
                                        color: "lightblue",
                                        textShadow:
                                            "-1px 1px 10px rgba(255,255,255)",
                                        fontWeight: "bold",
                                    }}
                                    to="/signup"
                                >
                                    Create an account
                                </Link>
                            </p>
                            <p>
                                <Link
                                    style={{
                                        textDecoration: "none",
                                        color: "lightblue",
                                        textShadow:
                                            "-1px 1px 10px rgba(255,255,255)",
                                        fontWeight: "bold",
                                    }}
                                    to="/"
                                >
                                    Back to Homepage
                                </Link>
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
