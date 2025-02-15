import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Movies from "./components/Movies";
import "./App.css";
import NavBar from "./components/NavBar";

function App() {
    return (
        <Router>
            <NavBar />
            <div className="App">
                <Movies />
            </div>
        </Router>
    );
}

export default App;
