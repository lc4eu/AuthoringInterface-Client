import React, { useEffect, useState } from 'react'
import { FaUser } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import Navbar from "../Navigation/Navbar";
import Button from "@material-ui/core/Button";
import { ServerStyleSheets } from '@material-ui/core';

const USRgenerate = () => {
  const [sentences, setMessage] = useState('');
  const [discourse_name, setDiscourseName] = useState('');
  const [showIframe, setShowIframe] = useState(false);
  const [receivedIndex, setReceivedIndex] = useState('');
  const [receivedItem, setReceivedItem] = useState('')
  const [autnam, setautnam] = useState([])
  window.addEventListener("message", receiveMessage, false);


  const saveChanges = () => {
    const body = {
      sentences: sentences,
      discourse_name: discourse_name
    };
    fetch('http://localhost:9999/usrgenerate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(response => {
        alert("USRs Generated Successfully")
      })
      .then(data => console.log(data))
      .then(setShowIframe(true))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetch('/api/uniq_auth_id2')
      .then(resAut => resAut.json())
      .then(dataAuth => setautnam(dataAuth))
  }, [])

  function receiveMessage(event) {
    const { index, item } = event.data;
    setReceivedIndex(index);
    setReceivedItem(item);
    console.log(item);
  }

  const handleMessageChange = event => {
    setMessage(event.target.value);
  };


  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    // setDiscourseName(file.name.split('.')[0]);
    setDiscourseName(handleDiscourse())
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      // console.log('content:', content); 
      const lines = content.split('\n');
      const hashLines = lines.filter((line) => line.startsWith('#'));
      const sentencearray = lines.filter((line) => line.startsWith('#')).map((line) => line.replace('#', '').replace('\r', ''));
      console.log('sentencearray:', sentencearray)
      const sentences = hashLines.map((line) => line.substr(1).trim()).join(' ');
      console.log('sentences:', sentences);
      setMessage(sentences);
      setShowIframe(true);

      const items = [];
      let subarray = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('#')) {
          // Ignore this line
          continue;
        }
        const item = line.replace('\r', '').split(',');
        subarray.push(item);
        if (i === lines.length - 1 || lines[i + 1].startsWith('#')) {
          // End of subarray
          items.push(subarray);
          subarray = [];
        }
      }
      console.log('items:', items);

      const keys = ['Concept', 'Index', 'SemCateOfNouns', 'GNP', 'DepRel', 'Discourse', 'SpeakersView', 'Scope', 'SentenceType', 'Construction'];
      const jsondata = [];

      for (let i = 0; i < items.length; i++) {
        let array = items[i];
        if (array.length > 10) {
          array = array.slice(0, 10);
        }
        const obj = {};
        for (let j = 0; j < array.length; j++) {
          if (keys[j] === "Construction") {
            obj[keys[j]] = [array[j].join(",")]; // concatenate all elements of array[j] and put as a single element array
          } else {
            obj[keys[j]] = array[j];
            if (['SemCateOfNouns', 'GNP', 'DepRel', 'Discourse', 'SpeakersView', 'Scope'].includes(keys[j]) && array[j].length > array[0].length) {
              obj[keys[j]] = array[j].slice(0, array[0].length); // reduce the value array to the length of the Concept value array
            }
            else if (array[j].length < array[0].length && keys[j] !== 'SentenceType') {
              // Add empty strings to the value array until its length matches that of the Concept value array
              const diff = array[0].length - array[j].length;
              for (let k = 0; k < diff; k++) {
                obj[keys[j]].push('');
              }
            }
          }
        }
        jsondata.push(obj);
      }


      console.log('jsondata:', jsondata);

      const body = {
        sentences: sentences,
        discourse_name: discourse_name,
        jsondata: jsondata,
        sentencearray: sentencearray
      };
      fetch('api/fileinsert/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
        .then(response => {
          alert("Usr generated Successfully")
        })
        .then(data => console.log(data))
        .catch(error => console.error(error));
    };
    reader.readAsText(file);
  };






  // const getData = () => {
  //   setShowIframe(true);
  // }

  const handleDiscourse = event => {

    setDiscourseName(event.target.value)
    // // let discourse_name = event.target.value;
    // if (discourse_name.length > 255) {
    //   alert("Discourse name length should not be more than 255.");
    //   event.target.value = '';
    // }
    // else if (!/^[a-zA-Z0-9_]+$/.test(discourse_name)) {
    //   alert("Discourse name can only contain letters, numbers, and underscores.");
    //   event.target.value = ''; // reset the input value
    // }
  }

  function handleSubmit(event) {
    event.preventDefault();
  }
  const getData = () => {
    fetch('http://localhost:9999/usrgenerate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "sentences": sentences })
    })
      .then(response => response.json())
      .then(response => {
        alert("Usr generated Successfully")
      })
      .then(response => console.log(JSON.stringify(response)))
      .then(() => setShowIframe(true))
    // setTimeout(() => {

    // }, 5000);
    // setShowIframe(true);

  }

  return (
    <>
      {/* <Navbar /> */}
      <nav>
        <NavLink to="/"><p>Authoring Interface</p></NavLink>
        <div>
          <ul id="navbar">
            <li><NavLink to="/dashboard"><FaUser></FaUser>{autnam.author_name}</NavLink></li>
            <li><NavLink to="/login">LOG OUT</NavLink></li>
          </ul>
        </div>
      </nav>

      <form onSubmit={handleSubmit}>

        <div class="entry_components">
          <div className="tta1">
            <p className="lab_discourse">Discourse</p>
            <textarea id="sentences" name="sentences" type="text" value={sentences} onChange={handleMessageChange} ></textarea></div>
          <div className="tta2">
            <div classname="label_discourse" ><p>Enter discourse name:</p></div>
            <input id="discourse_name" name="discourse_name" value={discourse_name} type="text" onChange={handleDiscourse} />
          </div>
          {/* <div className="ttab2"><input type='button' name="Save Sentences"  value="Save discourse" disabled='True' /></div> */}
          <div className="ttab3">
            <input type='file' onChange={handleFileSelect} />
            {/* <input type='submit' name="Generate USR" onClick={saveChanges} value="USR Generate" disabled={!sentences} /> */}
            <div className="ttab1"><input type='button' name="Generate USR" value="USR Generate" disabled={!sentences} onClick={getData} /></div>
          </div>
        </div>
        <div class="frame_container">
          <iframe className="outl" width="500" height="540" title="sentence" src={`/sentences/?sentence=${sentences}`} />
          <div className="usrtop"><iframe className="usr_usrtop" width="994px" id="usr" height="540" title="usr" src={`/usrtablepath?receivedindex=${receivedIndex}&discoursename=${discourse_name}&receivedItem=${receivedItem}`} /> </div>
        </div>

      </form>
    </>
  )
};

export default USRgenerate;