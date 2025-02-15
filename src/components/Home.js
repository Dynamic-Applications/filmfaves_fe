import React from "react";
import moviesimg from "../assets/images/netflix.jpg";

export default function Home() {
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
        ></div>
    );
}
