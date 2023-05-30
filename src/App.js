import React, { useEffect } from "react";
import Home from "./Navigation/Home";
import About from "./Navigation/About";
import Dashboard from "./Navigation/Dashboard";
import ContactUs from "./Navigation/ContactUs";
import Login from "./Navigation/Login";
import USRgenerate from "./USRgenerationFolder/USRgenerate";
import SignUp from "./Navigation/Signup";
import Sentences from "./USRgenerationFolder/Sentences";
import USR from "./USRgenerationFolder/USR";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navigation/Navbar";


function App() {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/usrgenerate" element={<USRgenerate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/sentences" element={<Sentences />} />
        <Route path="/usrtablepath" element={<USR />} />
      </Routes>
    </div>
  );
}

export default App;
