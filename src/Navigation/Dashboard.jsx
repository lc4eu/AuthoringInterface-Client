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
  let counter = 0;
  var counter2 = 0;
  var zip = new JSZip();
  const [authdata, setauthadat] = useState([])
  const [unqdis, setunqdis] = useState([])
  const [carddata, setcarddata] = useState([])
  const [udata, setusrdata] = useState([])


  const inddown = (sent, usr_data, usr_id, discourse_name) => {
    // usr_data = JSON.stringify(usr_data)
    usr_data = usr_data.replaceAll('\'', '\"')
    usr_data = JSON.parse(usr_data)
    const keys = Object.keys(usr_data);
    const values = keys.map(key => usr_data[key]);

    let str = ""
    str += "#" + sent + "\n"
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

  const jsonFileDownload = (sentences, discourse_id, discourse_name) => {
    let usrs = ""
    let usr_id = 0
    const ending = /(?<=[।]|.)/g;
    let arrsen = sentences.split(ending)
    udata.map(user2 => {
      return user2.discourse_id === discourse_id ? (
        <div className="down_content">
          {usrs = usrs + user2.orignal_USR_json}
          {usr_id += 1}
          {inddown(arrsen[usr_id - 1], usrs, usr_id, discourse_name)}
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
    let usr_l = []
    for (var i = 0; i < keys.length; i++) {
      str = str + keys[i] + " : " + values[i] + "\n"
    }
    return str
  }

  const handleDelete = () => {
    const shouldDelete = window.confirm('Are you sure you want to delete this item?');
    if (shouldDelete) {

    }
    else {

    }
  };

  const auth = () => {
    fetch("/api/uniq_auth_id2")
      .then(response => {
        return response.json()
      })
      .then(dataautdet => {
        setauthadat(dataautdet)
      })
  }

  const unidis = () => {
    fetch("/api/uniqu_dis")
      .then(response => {
        return response.json()
      })
      .then(dataautdet => {
        setunqdis(dataautdet)
      })
  }

  const cardata = () => {
    fetch("/api/card_data")
      .then(response => {
        return response.json()
      })
      .then(dataautdet => {
        setcarddata(dataautdet)
      })
  }

  const usrdata = () => {
    fetch("/api/dashboard_data")
      .then(response => {
        return response.json()
      })
      .then(dataautdet => {
        setusrdata(dataautdet)
      })
  }

  useEffect(() => {
    usrdata()
    cardata()
    auth()
    unidis()
  }, [])

  const [ddata, setddata] = useState([[]])
  const [discourseid, setDiscourseId] = useState([[]])
  // const url = `/usrgenerate_view?data=${ddata}`;
  const url = `/usrgenerate_view?did=${discourseid}`;



  const showUSR = (sentences, discourse_id, discourse_name) => {
    setDiscourseId(discourse_id)
    let str = []
    let d = []
    udata.map(usr => {
      return usr.discourse_id === discourse_id ? (
        <div className="show content">
          {str.push(usr.orignal_USR_json)}
        </div>
      ) : (
        <h1></h1>
      );
    })
    { d.push(sentences) }
    { d.push(discourse_id) }
    { d.push(discourse_name) }
    { d.push(str) }
    setddata(JSON.stringify(d))
  }




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
                <FaUser></FaUser> {authdata.author_name}

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


      <div className="components">
        <div className="cards">
          <div id="card">{carddata.discourse_count} Discourses created</div>
          <div id="card">{carddata.usr_count} USRs Generated</div>
          <div id="card">{carddata.app_count} Discourses Approved</div>
          <div id="card">
            <a className="hover_text" href="http://localhost:3000/usrgenerate" data-tooltip="Click to add new discourse.">
              <FaPlusCircle size="50px" color="black"></FaPlusCircle>
            </a>
          </div>
        </div>

        <div className="dis_table">
          <div className="dis_table_row1">
            <div className="dis_table_col_1">
              S.No
            </div>
            <div className="dis_table_col_1">
              Discourse Id
            </div>
            <div className="dis_table_col_2">
              Discourse
            </div>
            <div className="dis_table_col_3">
              USRs
            </div>
            <div className="dis_table_col_4">
              Actions
            </div>
            <div className="dis_table_col_5">
              Status
            </div>
          </div>

          {unqdis.length > 0 && (
            <ol>
              {unqdis.map(dis => (
                <div className="dis_table_row">
                  <div className="dis_table_col_1">{counter += 1}</div>
                  <div className="dis_table_col_1">{dis.discourse_id}</div>
                  <div className="dis_table_col_2">
                    <div className="expanded-text">
                      {dis.sentences.length > 50
                        ? <div className="short-name">{dis.sentences.substring(0, 50)}...</div>
                        : <div className="short-name">{dis.sentences}</div>
                      }
                      <div className="longer-name">{dis.sentences}</div>
                    </div>
                  </div>

                  <div className="dis_table_col_3">
                    {udata.length > 0 && (
                      <ul>
                        <div className="counter">
                          {counter2 = 0}
                        </div>
                        {udata.map(user => {
                          return user.discourse_id === dis.discourse_id ? (
                            <div className="usr_buttons">
                              {/* <a href={`/usrgenerate?view_sen=${dis.sentences} & view_dis_name=${dis.discourse_name} & view_usr=${dis.orignal_USR_json}`} class="hover_text" data-tooltip={format_json(user.orignal_USR_json)}>USR {counter2 += 1} </a> */}
                              <Popup trigger=
                                {<a className="hover_text">USR {counter2 += 1} </a>}
                                modal nested>
                                {
                                  close => (
                                    <div className='modal'>
                                      <div className='content'>
                                        {format_json(user.orignal_USR_json)}
                                      </div>
                                      <div>
                                        <button className="close_but" onClick=
                                          {() => close()}>
                                          Close
                                        </button>
                                        <div className="status_text">Status : {user.USR_status}</div>
                                      </div>
                                    </div>
                                  )
                                }
                              </Popup>
                            </div>
                          ) : (
                            <h2></h2>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                  <div className="dis_table_col_4">
                    <button className="but" onClick={(event) => showUSR(dis.sentences, dis.discourse_id, dis.discourse_name, event)}>
                      <div className="hover_text" data-tooltip="Click to view the discourse." >
                        <Link to={url}><FaEye id="action_button" size="20px" color="black"></FaEye></Link>
                        {/* <Link
                          to={{
                            pathname: "/usrgenerate_view",
                            state: ddata // your data array of objects
                          }}
                        ></Link> */}
                      </div>
                    </button>
                    <button className="but" onClick={(event) => showUSR(dis.sentences, dis.discourse_id, dis.discourse_name, event)}>
                      <div className="hover_text" data-tooltip="Click to view the discourse." >
                        <Link to={url}><FaEdit id="action_button" size="20px" color="black"></FaEdit></Link>
                      </div>
                    </button>

                    <button className="but">
                      <a onClick={handleDelete} href={`http://localhost:9999/delete_discourse?dis_id=${dis.discourse_id}`} className="hover_text" data-tooltip="Click to delete the discourse.">
                        <FaTrash id="action_button" size="20px" color="black"></FaTrash>
                      </a>
                    </button>
                    <button className="but" onClick={(event) => jsonFileDownload(dis.sentences, dis.discourse_id, dis.discourse_name, event)}>
                      <a className="hover_text" data-tooltip="Click to dowload the USRs for the discourse.">
                        <FaDownload id="action_button" size="20px" color="black"></FaDownload>
                      </a>
                    </button>

                  </div>
                  <div className="dis_table_col_5">{dis.USR_status}</div>
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


