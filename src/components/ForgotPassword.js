import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./Sign-In-Up.css";

const API_URL = process.env.REACT_APP_FILMFAVES_API;

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch(`${API_URL}/passresets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send reset link.");
            }

            setSuccessMessage(
                "If your email exists, we have sent a reset link!"
            );
            setTimeout(() => navigate("/signin"), 3000); // Redirect to sign-in after 3 seconds
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-background">
            <div className="auth-container">
                <h2 className="auth-title">Forgot Password</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Enter your email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {error && <p className="auth-error">{error}</p>}
                    {successMessage && (
                        <p className="auth-success">{successMessage}</p>
                    )}
                    <Button
                        color="inherit"
                        id="sub_btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Send Reset Link"
                        )}
                    </Button>
                </form>
                <footer className="auth-footer">
                    <p>
                        Remembered your password?{" "}
                        <Link to="/signin" className="auth-link">
                            Sign In
                        </Link>
                    </p>
                </footer>
            </div>
        </div>
    );
}
