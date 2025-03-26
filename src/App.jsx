import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Blog from "./components/Blog.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authData = localStorage.getItem("authToken");
        setIsAuthenticated(!!authData); // Convert to boolean (true if authData exists)
    }, []);

    return (
        <BrowserRouter>
            <ToastContainer />
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/blog" replace /> : <Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/blog" element={isAuthenticated ? <Blog /> : <Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
