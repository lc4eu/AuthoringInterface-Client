import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import "./login_css.css"
import { NavLink } from "react-router-dom";

import customAxios from "../axios";

import messages from '../constants/messages';

const Signup = () => {

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const formTarget = event.target;
      const params = {
        author_name: formTarget.author_name.value,
        email: formTarget.email.value,
        password: formTarget.password.value,
        reviewer_role: formTarget.reviewer_role.value
      };

      const result = await customAxios.post('/signup', params);

      if (result.status === 200) {
        alert(messages.signupSuccessfully);
        return navigate('/login');
      }

      if (result.response?.status === 400) {
        return alert(messages.invalidEmailAddress);
      }

      if (result.response?.status === 409) {
        return alert(messages.userWithThisEmailAlreadyExists);
      }

      alert(messages.somethingWentWrong);

    } catch (exception) {
      console.log(exception);
    }
  }

  // const handleSubmit = event => {
  //   event.preventDefault();

  //   fetch('api/signup/', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ "author_name": event.target.author_name.value, "email": event.target.email.value, 'password': event.target.password.value, 'reviewer_role': event.target.reviewer_role.value })
  //   })
  //     .then(response => {
  //       if (response.status === 200) {
  //         alert("Sign up Successfully!");
  //         navigate('/login');
  //       }
  //       else if (response.status === 400) {
  //         alert("Invalid Email address!");
  //         navigate('/signup');
  //       }
  //       else if (response.status === 409) {
  //         alert('User already exist!')
  //         navigate('/signup');
  //       }
  //     })
  //     .then(response => console.log(JSON.stringify(response)))
  //     .catch(error => console.error(error));
  // }

  return (
    <div class="adcontent">
      <form onSubmit={handleSubmit}>
        <div class="headname">
          <h1>SIGN UP</h1>
        </div>

        <div class="field">
          <label for="author_name">Username</label>
          <input id="author_name" type="text" name="author_name" required />
        </div>
        <div class="field">
          <label for="email">Email</label>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input id="email" type="text" name="email" required />
        </div>
        <div class="field">
          <label for="password">Password</label>&nbsp;&nbsp;
          <input id="password" type="password" name="password" required />
        </div>

        <div class="radio2">
          <p>
            Reviewer Role:&nbsp;&nbsp;
            <input
              type="radio"
              id="a_reviewer_role"
              name="reviewer_role"
              value="Reviewer"
            />
            <label for="reviewer_role">Yes</label>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input
              type="radio"
              id="r_reviewer_role"
              name="reviewer_role"
              value="Author"
            />
            <label for="reviewer_role">No</label>
          </p>
        </div>

        <div class="adbutton">
          <button type="submit" value="SIGN UP" >SIGN UP</button>
        </div>

        <p>
          Already have an account?<NavLink to="/login">LOGIN</NavLink>
        </p>
      </form>
    </div>
  );
};

export default Signup;
