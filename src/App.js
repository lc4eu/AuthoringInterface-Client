import React from "react";
import Home from "./Navigation/Home";
import About from "./Navigation/About";
import Dashboard from "./Navigation/Dashboard";
import DashboardR from "./Navigation/Dashboard_Reviewer";
import ContactUs from "./Navigation/ContactUs";
import Login from "./Navigation/Login";
import USRgenerate from "./USRgenerationFolder/USRgenerate";
import SignUp from "./Navigation/Signup";
import Sentences from "./USRgenerationFolder/Sentences";
import USR from "./USRgenerationFolder/USR";
import USRV from "./USRgenerationFolder/USR_view";
import { Routes, Route } from "react-router-dom";
import Logout from "./Navigation/Logout";
import USRgenerate_view from "./USRgenerationFolder/USRgenerate_view";
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
        <Route path="/logout" element={<Logout />} />
        <Route path="/usrgenerate" element={<USRgenerate />} />
        <Route path="/usrgenerate_view" element={<USRgenerate_view />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboardr" element={<DashboardR />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/sentences" element={<Sentences />} />
        <Route path="/usrtablepath" element={<USR />} />
        <Route path="/usredit" element={<USRV />} />
      </Routes>
    </div>
  );
}

export default App;
