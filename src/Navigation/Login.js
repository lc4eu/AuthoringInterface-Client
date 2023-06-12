import React from "react";
import "./style.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./login_css.css"
import customAxios from "../axios";
import messages from '../constants/messages';
import { storeIntoApplicationStorage } from "../utilities/storage";

const Login = () => {

  const navigate = useNavigate();

  async function handleLoginSubmit(event) {

    event.preventDefault();

    try {

      const formTarget = event.target;
      const params = {
        email: formTarget.email.value,
        password: formTarget.password.value,
        reviewer_role: formTarget.reviewer_role.value
      };

      const result = await customAxios.post('/login', params);

      if (result.response?.status === 401) {
        return alert(messages.invalidCredentials);
      }

      if (result.status === 200) {
        alert(messages.loginSuccessfully);
        storeIntoApplicationStorage(result.data)
        localStorage.setItem("author_name", result.data['author_name'])
        localStorage.setItem("author_id", result.data['author_id'])
        localStorage.setItem("email", result.data['email'])
        localStorage.setItem("reviewer_role", result.data['reviewer_role'])
        localStorage.setItem("in_session", true)
        return navigate('/dashboard');
      }

      alert(messages.somethingWentWrong);

    } catch (exception) {
      console.log(exception);
    }
  }

  // const handleLoginSubmit = event => {

  //   event.preventDefault();

  //   fetch('api/login/', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ "email": event.target.email.value, "password": event.target.password.value, 'reviewer_role': event.target.role.value })
  //   })
  //     .then(result => {
  //       if (result.status === 200) {
  //         alert("Login Successfully!");
  //         navigate('/usrgenerate');
  //       }
  //       else if (result.status === 201) {
  //         alert("Login Successfully!");
  //         navigate('/');
  //       }
  //       else if (result.status === 202) {
  //         alert("You are not a reviewer!");
  //         navigate('/login');
  //       }
  //       else if (result.status === 203) {
  //         alert("Login Successfully!");
  //         navigate('/usrgenerate');
  //       }
  //       else if (result.status === 401) {
  //         alert("Invalid credentials!");
  //       }
  //     })
  //     .then(result => console.log(JSON.stringify(result)))
  //     .catch(error => console.error(error));
  // }

  return (
    <div className="adcontent">
      <form onSubmit={handleLoginSubmit}>
        <div className="headname">
          <h1>LOGIN</h1>
        </div>
        <div className="field">
          <label for="email">Email</label>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="text" name="email" id="email" required />
        </div>

        <div className="field">
          <label for="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>

        <div className="radio">
          <input type="radio" id="a_role" name="reviewer_role" value="Author" />
          <label for="Author">Author</label>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="radio" id="r_role" name="reviewer_role" value="Reviewer" />
          <label for="reviewer_role">Reviewer</label>
        </div>

        <div className="adbutton">
          <input type="submit" value="LOG IN" />
        </div>
      </form>

      <p>
        Don't have any account?<NavLink to="/signup">SIGN UP</NavLink>
      </p>
      <br />
      <br />
    </div>
  );
};

export default Login;