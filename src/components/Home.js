import React, { useEffect } from "react";
import moviesimg from "../assets/netflix.jpg";

export default function Home() {
    useEffect(() => {
        // Lock scrolling on the body when the component is mounted
        document.body.style.overflow = "hidden";

        // Clean up to restore scroll functionality if the component is unmounted
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div
            style={{
                backgroundImage: `url(${moviesimg})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100vh", // Full viewport height
                margin: 0, // Remove any default margin
                padding: 0, // Remove any default padding
                display: "flex", // Optional: if you want to add content over the image
                flexDirection: "column", // For layout management if needed
                overflow: "hidden", // Prevent scrolling in this container as well
            }}
        ></div>
    );
}
