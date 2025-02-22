import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function AutoLogout() {
    const navigate = useNavigate();
    const logoutTimer = useRef(null);

    useEffect(() => {
        const handleAutoLogout = () => {
            alert("Session expired due to inactivity. Logging out...");
            localStorage.removeItem("token");
            navigate("/"); // Navigate to login or home
            window.location.reload(); // Force reload to clear user state
        };

        const resetTimer = () => {
            if (logoutTimer.current) clearTimeout(logoutTimer.current);
            logoutTimer.current = setTimeout(
                handleAutoLogout,
                INACTIVITY_LIMIT
            );
        };

        // Attach event listeners to track user activity
        const events = ["mousemove", "keypress", "click", "scroll"];
        events.forEach((event) => window.addEventListener(event, resetTimer));

        resetTimer(); // Start the timer initially

        return () => {
            if (logoutTimer.current) clearTimeout(logoutTimer.current);
            events.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            );
        };
    }, [navigate]);

    return null; // This component doesn't render anything
}
