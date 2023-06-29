import "./style.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import React from 'react';
import Button from "@material-ui/core/Button";
import { getApplicationStorage, clearApplicationStorage } from "../utilities/storage";
import messages from "../constants/messages";

import customAxios from '../axios';

function Navbar(props) {

  const navigate = useNavigate();

  const _session = getApplicationStorage();

  async function handleLogoutControlClick() {
    try {

      const result = await customAxios.get('/logout');
      clearApplicationStorage();
      navigate('/');

    } catch (exception) {
      console.log(exception);
    }
  }

  async function handleChangePasswordClick() {
    try {
      const shouldchange = window.confirm('Are you sure you want to change the password?');
      if (shouldchange) {
        const result = await customAxios.delete(`/change_password/${localStorage.getItem('author_id')}`);
        if (result.response?.status === 400) {
          return alert(messages.couldNotDeleteDiscourse);
        }

        if (result.status === 200) {
          alert(messages.discourseDeletedSuccessfully);
          return window.location.reload();
        }
      }
      else {
      }
    }
    catch (exception) {
      console.log(exception)
    }
  }

  function renderNavbar() {

    return (
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
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
          )}
          {props.hideLogin ? null : (
            <li>
              <NavLink to="/login">LOGIN</NavLink>
            </li>
          )}
          {/* {props.hideLogin ? null : (
            <li>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
          )} */}
          {/* {props.hideUsrGenerate ? null : <li><NavLink to="/usrgenerate">Generate USR</NavLink></li>} */}
        </ul>
      </div>
    );
  }

  function renderUserNavbar() {

    return (
      <div>
        <ul id="navbar">
          <li>
            <NavLink to="/dashboard">
              <FaUser></FaUser> {_session.author_name}
            </NavLink>
          </li>
          <li>
            <Button variant="contained" onClick={handleChangePasswordClick}>
              Change Password
            </Button>
          </li>
          <li>
            <Button variant="contained" onClick={handleLogoutControlClick}>
              Logout
            </Button>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <>
      <nav>
        <NavLink to="/">
          <p>Authoring Interface</p>
        </NavLink>
        {_session ? renderUserNavbar() : renderNavbar()}
      </nav>
    </>
  );
}
export default Navbar;