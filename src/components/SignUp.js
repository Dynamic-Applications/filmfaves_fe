import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Alert } from "@mui/material";
import "./Sign-In-Up.css";

const API_URL = process.env.REACT_APP_FILMFAVES_API;

export default function SignUp() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(result.message);
                setTimeout(() => {
                    navigate("/signin");
                }, 2000);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="auth-background">
            <div className="auth-container">
                <h2 className="auth-title">Sign Up</h2>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <label>Email address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Button color="inherit" id="sub_btn" type="submit">
                        Sign Up
                    </Button>
                </form>
                <footer className="auth-footer">
                    <p>
                        Already have an account?{" "}
                        <Link to="/signin" className="auth-link">
                            Sign In
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
