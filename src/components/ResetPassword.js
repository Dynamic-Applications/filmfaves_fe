import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import "./Sign-In-Up.css";

const API_URL = process.env.REACT_APP_FILMFAVES_API;

export default function ResetPassword() {
    const { token } = useParams(); // Get the token from the URL params
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError("Invalid or expired reset token.");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}passresets/reset-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        resetToken: token,
                        newPassword: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to reset password.");
            }

            setSuccessMessage(
                "Password reset successful. You can now sign in."
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
                <h2 className="auth-title">Reset Password</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label htmlFor="password">New Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="confirmPassword">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                            "Reset Password"
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
