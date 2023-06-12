import { FaDownload, FaEdit, FaEye, FaPlusCircle, FaTrash, FaUser } from "react-icons/fa";
import "./dashboard_css.css";
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';
import axios from "axios";
import messages from '../constants/messages';
import customAxios from "../axios";
import { useNavigate } from "react-router-dom";


var JSZip = require("jszip");

const Dashboard = () => {

  const serverURl = process.env.REACT_APP_API_BASE_URL;

  var SNo = 0;
  var USR_SNo = 0;
  var zip = new JSZip();

  const [uniquediscourse, setuniquediscourse] = useState([])
  const [carddata, setcarddata] = useState([])
  const [usrdata, setusrdata] = useState([])

  const navigate = useNavigate();


  const inddown = (sent, usr_data, usr_id, discourse_name) => {
    // usr_data = JSON.stringify(usr_data)
    usr_data = usr_data.replaceAll('\'', '\"')
    usr_data = JSON.parse(usr_data)
    const keys = Object.keys(usr_data);
    const values = keys.map(key => usr_data[key]);

    let str = ""
    str += "#" + sent + "\n"
    for (var i = 0; i < keys.length; i++) {
      str = str + values[i]
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
    const ending = /\।|\?|\||\./;
    let arrsen = sentences.split(ending)
    usrdata.map((user2, index) => {
      return user2.discourse_id === discourse_id ? (
        <div key={index} className="down_content">
          {usrs = usrs + user2.orignal_USR_json}
          {usr_id += 1}
          {inddown(arrsen[usr_id - 1], usrs, usr_id, discourse_name)}
          {usrs = ""}

        </div>
      ) : (
        <h2 key={index}></h2>
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

  async function handleDelete(discourse_id) {
    try {
      const shouldDelete = window.confirm('Are you sure you want to delete this item?');
      if (shouldDelete) {
        const result = await customAxios.delete(`/delete_discourse/${discourse_id}`);
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
  };


  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          const result = await axios.get(`${serverURl}/dicourses_for_a_user/${localStorage.getItem("author_id")}`);
          setuniquediscourse(result.data);
        } catch (error) {
          console.error(error.message);
        }
      }
      fetchData();
    }
    catch (exception) {
      console.log(exception)
    }
  }, [])


  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          const result = await axios.get(`${serverURl}/card_data/${localStorage.getItem("author_id")}`);
          setcarddata(result.data);
        } catch (error) {
          console.error(error.message);
        }
      }
      fetchData();
    }
    catch (exception) {
      console.log(exception)
    }
  }, [])

  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          const result = await axios.get(`${serverURl}/usr_corresponding_to_discourse/${localStorage.getItem("author_id")}`);
          setusrdata(result.data);
        } catch (error) {
          console.error(error.message);
        }
      }
      fetchData();
    }
    catch (exception) {
      console.log(exception)
    }
  }, [])

  function renderCards() {
    return (
      <div className="cards">
        <div id="card">{carddata.discourse_count} Discourses created</div>
        <div id="card">{carddata.usr_count} USRs Generated</div>
        <div id="card">{carddata.approved_count} Discourses Approved</div>
        <div id="card">
          <Link to={"/usrgenerate"} className="hover_text" data-tooltip="Click to add new discourse.">
            <FaPlusCircle size="50px" color="black"></FaPlusCircle>
          </Link>
        </div>
      </div>
    );
  }

  function renderAuthorDashboardTable() {
    return (
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

        {uniquediscourse.length > 0 && (
          <ol>
            {uniquediscourse.map((dis, index) => (
              <div key={index} className="dis_table_row">
                <div className="dis_table_col_1">{SNo += 1}</div>
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
                  {usrdata.length > 0 && (
                    <ul>
                      <div className="counter">
                        {USR_SNo = 0}
                      </div>
                      {usrdata.map((user, i) => {
                        return user.discourse_id === dis.discourse_id ? (
                          <div key={i} className="usr_buttons">
                            {/* <a href={`/usrgenerate?view_sen=${dis.sentences} & view_dis_name=${dis.discourse_name} & view_usr=${dis.orignal_USR_json}`} class="hover_text" data-tooltip={format_json(user.orignal_USR_json)}>USR {counter2 += 1} </a> */}
                            <Popup trigger=
                              {<a className="hover_text">USR {USR_SNo += 1} </a>}
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
                          <h2 key={i}></h2>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <div className="dis_table_col_4">
                  {/* <button className="but">
                      <div className="hover_text" data-tooltip="Click to view the discourse.">
                        <Link to={`/usrgenerate?hidecontrols=${true}&dasboard_discourseid_for_edit=${dis.discourse_id}&edit_from_dasboard=${true}`}><FaEye id="action_button" size="20px" color="black"></FaEye></Link>
                      </div>
                    </button> */}
                  <button className="but">
                    <div className="hover_text" data-tooltip="Click to view the discourse." >
                      <Link to={`/usrgenerate?dasboard_discourseid_for_edit=${dis.discourse_id}&edit_from_dasboard=${true}`}><FaEdit id="action_button" size="20px" color="black"></FaEdit></Link>
                    </div>
                  </button>

                  <button className="but">
                    <a onClick={() => handleDelete(dis.discourse_id)} className="hover_text" data-tooltip="Click to delete the discourse.">
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
    );
  }

  return (
    <>
      <div className="components">
        {renderCards()}
        {renderAuthorDashboardTable()}
      </div >

    </>

  );
};
export default Dashboard;