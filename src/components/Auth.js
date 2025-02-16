import React from "react";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        // Redirect to login if token is missing
        return <Navigate to="/signin" />;
    }

    // Render the protected component if authenticated
    return children;
}
