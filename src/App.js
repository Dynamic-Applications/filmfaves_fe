import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Main from "./components/homepage/Main";
import Home from "./components/Home";
import Movies from "./components/Movies";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import NavBar from "./components/navebar/NavBar";
import RequireAuth from "./components/Auth"; // Auth wrapper component
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Users from "./components/Users";

function App() {
    return (
        <Router>
            <NavBar />
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/passresets" element={<ForgotPassword />} />
                    <Route path="/users" element={<Users />} />
                    <Route
                        path="/reset-password/:token"
                        element={<ResetPassword />}
                    />
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
