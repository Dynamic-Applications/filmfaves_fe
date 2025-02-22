


const API_URL = process.env.REACT_APP_FILMFAVES_API;

export const handleLogout = async (setIsLoggedIn, navigate) => {
    try {
        const response = await fetch(`${API_URL}/auth/logout` || "http://localhost:4000/auth/logout", {
            method: "GET",
            credentials: "include", // Include cookies in the request
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Display success message
            localStorage.removeItem("token"); // Remove token from localStorage
            setIsLoggedIn(false); // Update state to reflect logged-out status
            navigate("/"); // Redirect to the homepage
        } else {
            console.error(
                "Failed to log out:",
                data.message || "Unknown error."
            );
        }
    } catch (error) {
        console.error("Error during logout:", error.message);
    }
};
