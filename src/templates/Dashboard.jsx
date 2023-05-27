import { NavLink, redirect } from "react-router-dom";
import { FaDownload, FaEdit, FaEye, FaPlusCircle, FaTrash, FaUser } from "react-icons/fa";
import "./dashboard_css.css";
import Button from "@material-ui/core/Button";
import Stack from '@mui/material/Stack';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Link, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import Modal from 'react-modal';
import axios from "axios";
import { Pagination } from "@mui/material";




var JSZip = require("jszip");

const Dashboard = () => {

  const [users, setUsers] = useState([])
  const [discourse, setdis] = useState([])
  const [usr, setusr] = useState([])
  const [autnam, setautnam] = useState([])
  const [counts, setcounts] = useState([])
  const [modalIsOpen, setModalIsOpen] = useState(false);

  let counter = 0;

  var counter2 = 0;
  const openModal = () => {
    setModalIsOpen(true);
  }

  const closeModal = () => {
    setModalIsOpen(false);
  }



  useEffect(() => {
    Promise.all([
      fetch('http://localhost:9999/dash_data'),
      fetch('http://localhost:9999/uni_discourse'),
      fetch('http://localhost:9999/USR'),
      fetch('http://localhost:9999/authName'),
      fetch('http://localhost:9999/about'),
    ])
      .then(([resUsers, resdis, resusr, resAut, resabout]) =>
        Promise.all([resUsers.json(), resdis.json(), resusr.json(), resAut.json(), resabout.json()])
      )
      .then(([dataUsers, datadis, datausr, dataAuth, dataCount]) => {
        setUsers(dataUsers);
        setdis(datadis);
        setusr(datausr);
        setautnam(dataAuth);
        setcounts(dataCount);
      });
  }, []);


  var zip = new JSZip();

  const inddown = (usr_data, usr_id, discourse_name) => {
    // usr_data = JSON.stringify(usr_data)
    usr_data = usr_data.replaceAll('\'', '\"')
    usr_data = JSON.parse(usr_data)
    const keys = Object.keys(usr_data);
    const values = keys.map(key => usr_data[key]);

    let str = ""
    for (var i = 0; i < keys.length; i++) {
      str = str + keys[i] + " : " + values[i]
      str += "\n"
    }
    const json_data = str
    const fileName = discourse_name + "_USR_" + usr_id + ".txt";
    const data = new Blob([json_data], { type: "text/plain;charset=utf-8" });
    zip.file(fileName, data);
    const jsonURL = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = jsonURL;
    link.setAttribute("download", fileName);
    // link.click();
    document.body.removeChild(link);
  };


  const jsonFileDownload = (discourse_id, discourse_name) => {
    let usrs = ""
    let usr_id = 0
    users.map(user2 => {
      return user2.discourse_id === discourse_id ? (
        <div class="down_content">
          {usrs = usrs + user2.orignal_USR_json}
          {usr_id += 1}
          {inddown(usrs, usr_id, discourse_name)}
          {usrs = ""}

        </div>
      ) : (
        <h2></h2>
      );
    })
    zip.generateAsync({ type: "blob" })
      .then(function (content) {
        // see FileSaver.js
        saveAs(content, discourse_name + ".zip");
      });
  };

  const format_json = (json) => {
    // json = JSON.stringify(json)
    json = json.replaceAll('\'', '"')
    json = JSON.parse(json)
    const keys = Object.keys(json);
    const values = keys.map(key => json[key]);

    let str = ""
    for (var i = 0; i < keys.length; i++) {
      str = str + keys[i] + " : " + values[i] + "\n"
    }
    return str
  }


  const handleDelete = () => {
    // Show a confirmation dialog before proceeding with deletion
    if (window.confirm("Are you sure you want to delete this record?")) {
      // Perform the deletion logic here
      console.log("Record deleted!"); // Replace with your actual deletion logic
    }
    else {
      console.log("Deletion canceled."); // Optional: handle cancellation
    }
  };


  return (
    <>
      <nav>
        <NavLink to="/">
          <p>Authoring Interface</p>
        </NavLink>
        <div>
          <ul id="navbar">
            <li>
              <NavLink to="/dashboard">
                <FaUser></FaUser> {autnam.author_name}
              </NavLink>
            </li>
            <li>
              <Button variant="contained" href="http://localhost:9999/logout">
                Logout
              </Button>
            </li>
          </ul>
        </div>
      </nav>

      <div class="components">
        <div class="cards">
          <div id="card">{counts.discourse_count} Discourses created</div>
          <div id="card">{counts.usr_count} USRs Generated</div>
          <div id="card">{counts.app_count} Discourses Approved</div>
          <div id="card">
            <a class="hover_text" href="http://localhost:3000/usrgenerate" data-tooltip="Click to add new discourse.">
              <FaPlusCircle size="50px" color="black"></FaPlusCircle>
            </a>
          </div>
        </div>

        <div class="dis_table">
          <div class="dis_table_row1">
            <div class="dis_table_col_1">
              S.No
            </div>
            <div class="dis_table_col_2">
              Discourse
            </div>
            <div class="dis_table_col_3">
              USRs
            </div>
            <div class="dis_table_col_4">
              Actions
            </div>
            <div class="dis_table_col_5">
              Status
            </div>
          </div>

          {discourse.length > 0 && (
            <ol>
              {discourse.map(dis => (
                <div class="dis_table_row">
                  <div class="dis_table_col_1">{counter += 1}</div>
                  <div class="dis_table_col_2">
                    <div class="expanded-text">
                      {dis.sentences.length > 50
                        ? <div class="short-name">{dis.sentences.substring(0, 50)}...</div>
                        : <div class="short-name">{dis.sentences}</div>
                      }
                      <div class="longer-name">{dis.sentences}</div>
                    </div>
                  </div>

                  <div class="dis_table_col_3">
                    {users.length > 0 && (
                      <ul>
                        <div class="counter">
                          {counter2 = 0}
                        </div>
                        {users.map(user => {
                          return user.discourse_id === dis.discourse_id ? (
                            <div class="usr_buttons">
                              <a href={`/usrgenerate?view_sen=${dis.sentences} & view_dis_name=${dis.discourse_name} & view_usr=${dis.orignal_USR_json}`} class="hover_text" data-tooltip={format_json(user.orignal_USR_json)}>USR {counter2 += 1} </a>
                            </div>
                          ) : (
                            <h2></h2>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                  <div class="dis_table_col_4">
                    <button class="but">
                      <a href={`/usrgenerate_view?view_sen=${dis.sentences} & view_dis_name=${dis.discourse_name} & view_usr=${dis.orignal_USR_json}`} class="hover_text" data-tooltip="Click to view the discourse." >
                        <FaEye id="action_button" size="20px" color="black"></FaEye>
                      </a>
                    </button>
                    <button class="but">
                      <a href={`/usrgenerate?view_sen=${dis.sentences} & view_dis_name=${dis.discourse_name} & view_usr=${dis.orignal_USR_json}`} class="hover_text" data-tooltip="Click to edit the discourse.">
                        <FaEdit id="action_button" size="20px" color="black"></FaEdit>
                      </a>
                    </button>
                    <button class="but">
                      <a onClick={handleDelete} href={`http://localhost:9999/delete_discourse?dis_id=${dis.discourse_id}`} class="hover_text" data-tooltip="Click to delete the discourse.">
                        <FaTrash id="action_button" size="20px" color="black"></FaTrash>
                      </a>
                    </button>
                    <button class="but" onClick={(event) => jsonFileDownload(dis.discourse_id, dis.discourse_name, event)}>
                      <a class="hover_text" data-tooltip="Click to dowload the USRs for the discourse.">
                        <FaDownload id="action_button" size="20px" color="black"></FaDownload>
                      </a>
                    </button>

                  </div>
                  <div class="dis_table_col_5">{dis.USR_status}</div>
                </div>
              ))}
            </ol>
          )}
        </div>
      </div >
      {/* <Stack spacing={2}>
        <Pagination count={10} showFirstButton showLastButton />
      </Stack> */}
    </>

  );
};
export default Dashboard;
