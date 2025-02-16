import React, { useState } from "react";
import "./SignIn.css";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Alert } from "@mui/material";
import moviesimg from "../assets/images/netflix.jpg";

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
            const response = await fetch(
                `${API_URL}/auth/register` ||
                    "http://localhost:4000/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (response.ok) {
                setSuccess(result.message);
                setTimeout(() => {
                    navigate("/SignIn"); // Redirect to Sign In page
                }, 2000);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
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
                        Sign Up
                    </h2>

                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}

                    <form className="fontColor" onSubmit={handleSubmit}>
                        <p>
                            <label>Username</label>
                            <br />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </p>
                        <p>
                            <label>Email address</label>
                            <br />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </p>
                        <p>
                            <label>Password</label>
                            <br />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </p>
                        <p>
                            <Button color="inherit" id="sub_btn" type="submit">
                                Sign Up
                            </Button>
                        </p>
                    </form>
                    <footer>
                        <div className="footers">
                            <p>
                                Already have an account?{" "}
                                <Link
                                    style={{
                                        textDecoration: "none",
                                        color: "lightblue",
                                        textShadow:
                                            "-1px 1px 10px rgba(255,255,255)",
                                        fontWeight: "bold",
                                    }}
                                    to="/SignIn"
                                >
                                    Sign In
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
