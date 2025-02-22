import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import "./Sign-In-Up.css";

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
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok)
                throw new Error(data.message || "Failed to login.");

            localStorage.setItem("token", data.token);
            alert(data.message);
            navigate("/movies"); // Navigate to movies after successful login
            window.location.reload(); // Force reload to update user state
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-background">
            <div className="auth-container">
                <h2 className="auth-title">Sign In</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <div className="password-container">
                        <label htmlFor="password">Password</label>
                        <Link to="/passresets" className="forgot-password-link">
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="auth-error">{error}</p>}
                    <Button
                        color="inherit"
                        id="sub_btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Sign In"}
                    </Button>
                </form>

                <footer className="auth-footer">
                    <p>
                        First time?{" "}
                        <Link to="/signup" className="auth-link">
                            Create an account
                        </Link>
                    </p>
                    <p>
                        <Link to="/" className="auth-link">
                            Back to Homepage
                        </Link>
                    </p>
                </footer>
            </div>
        </div>
    );
}
