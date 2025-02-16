// import React from "react";
// import { BrowserRouter as Router } from "react-router-dom";
// import Movies from "./components/Movies";
// import "./App.css";
// import NavBar from "./components/NavBar";

// function App() {
//     return (
//         <Router>
//             <NavBar />
//             <div className="App">
//                 <Movies />
//             </div>
//         </Router>
//     );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Movies from "./components/Movies";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import NavBar from "./components/NavBar";
import RequireAuth from "./components/Auth"; // Auth wrapper component

function App() {
    return (
        <Router>
            <NavBar />
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    {/* Protect the Movies route */}
                    <Route
                        path="/movies"
                        element={
                            <RequireAuth>
                                <Movies />
                            </RequireAuth>
                        }
                    />
                    {/* Default redirect or homepage */}
                    <Route path="/" element={<SignIn />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
