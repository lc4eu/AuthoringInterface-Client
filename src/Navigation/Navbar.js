import "./style.css";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from 'react';
import React from 'react';



function Navbar(props) {
  // const [utype, setutype] = useState('')

  // const userty = () => {
  //   fetch("/api/usertype")
  //     .then(response => {
  //       return response.json()
  //     })
  //     .then(dataautdet => {
  //       setutype(dataautdet)
  //     })
  // }
  // useEffect(() => {
  //   userty()
  // }, [])
  // console.log(setutype)
  return (
    <>
      <nav>
        <NavLink to="/">
          <p>Authoring Interface</p>
        </NavLink>
        <div>
          <ul id="navbar">
            {props.hideHome ? (
              <li style={{ display: "none" }}>
                <NavLink className="home_active" to="/">
                  Home
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink className="home_active" to="/">
                  Home
                </NavLink>
              </li>
            )}
            {props.hideAbout ? null : (
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
            )}
            {props.hideContact ? null : (
              <li>
                <NavLink to="/contact">Contact Us</NavLink>
              </li>
            )}
            {props.hideLogin ? null : (
              <li>
                <NavLink to="/login">LOGIN</NavLink>
              </li>
            )}
            {props.hideLogin ? null : (
              <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
            )}
            {/* {props.hideUsrGenerate ? null : <li><NavLink to="/usrgenerate">Generate USR</NavLink></li>} */}
          </ul>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
