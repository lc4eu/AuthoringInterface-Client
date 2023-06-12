import React, { useEffect, useState } from 'react'
import customAxios from "../axios";
import axios from 'axios';
import messages from '../constants/messages';
import Sentences from './Sentences';
import USR from './USR';
import { CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";


const USRgenerate = () => {
  const [discourse, setDiscourse] = useState('');
  const [discourse_name, setDiscourseName] = useState('');
  const [discourseId, setDiscourseId] = useState('');
  const [showIframe, setShowIframe] = useState(false);
  const [receivedIndex, setReceivedIndex] = useState('');
  const [receivedItem, setReceivedItem] = useState('')
  const [showUSREditTable, setshowUSREditTable] = useState(false);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();



  const serverURl = process.env.REACT_APP_API_BASE_URL;

  window.addEventListener("message", receiveMessage, false);

  function receiveMessage(event) {
    const { index, item } = event.data;
    setReceivedIndex(index);
    setReceivedItem(item);
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  function handleDiscourseContent(event) {
    try {
      setDiscourse(event.target.value);
    }
    catch (exception) {
      console.log(exception)
    }
  };

  function handleDiscourseName(event) {
    try {
      setDiscourseName(event.target.value);
    }
    catch (exception) {
      console.log(exception)
    }
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

  async function handleFileSelection(event) {
    setLoading(true)
    const file = event.target.files[0];
    const file_name = file.name.split('.')[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      const lines = content.split('\n');
      const hashLines = lines.filter((line) => line.startsWith('#'));
      const sentencearray = lines.filter((line) => line.startsWith('#')).map((line) => line.replace('#', '').replace('\r', ''));
      const sentences = hashLines.map((line) => line.substr(1).trim()).join(' ');
      setDiscourseName(file_name);
      setDiscourse(sentences);
      setShowIframe(true);

      const array_of_usrs = [];
      let subarray_of_usrs = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('#')) {
          // Ignore this line
          continue;
        }
        const item = line.replace('\r', '').split(',');
        subarray_of_usrs.push(item);
        if (i === lines.length - 1 || lines[i + 1].startsWith('#')) {
          // End of subarray
          array_of_usrs.push(subarray_of_usrs);
          subarray_of_usrs = [];
        }
      }
      console.log('array_of_usrs:', array_of_usrs);

      const keys = ['Concept', 'Index', 'SemCateOfNouns', 'GNP', 'DepRel', 'Discourse', 'SpeakersView', 'Scope', 'SentenceType', 'Construction'];
      const jsondata = [];

      for (let i = 0; i < array_of_usrs.length; i++) {
        let array = array_of_usrs[i];
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

      const params = {
        sentences: sentences,
        discourse_name: file_name,
        jsondata: jsondata,
        sentencearray: sentencearray,
        author_id: localStorage.getItem("author_id")
      };
      const result = await customAxios.post('/fileinsert', params);
      setDiscourseId(result.data)
      setshowUSREditTable(true)
      if (result.status === 200) {
        alert(messages.USRsGeneratedSuccessfully);
        setLoading(false)
      }

      if (result.response?.status === 400) {
        return alert(messages.USRsCouldNotBeGeneratedSuccessfully);
      }
    };
    reader.readAsText(file);
  };

  async function handleAutomaticGeneratedUSRs(event) {
    event.preventDefault()
    setLoading(true)
    try {
      const params = {
        discourse: discourse,
        discourse_name: discourse_name,
        author_id: localStorage.getItem("author_id")
      };
      // console.log(author_id)
      const result = await customAxios.post("/usrgenerate", params);

      if (result.status === 200) {
        setDiscourseId(result.data)
        setDiscourse(discourse)
        setDiscourseName(discourse_name)
        setShowIframe(true)
        setshowUSREditTable(true)
        setLoading(false)
        return alert(messages.AutomaticUSRsGeneratedSuccessfully);
        // return navigate(`/usrgenerate?dasboard_discourseid_for_edit=${result.data}&edit_from_dasboard=${true}`)
      }
      if (result.response?.status === 400) {
        return alert(messages.AutomaticUSRsCouldNotBeGenerated);
      }
    }
    catch (exception) {
      console.log(exception)
    }
  }

  useEffect(() => {
    try {
      const fetchData = async () => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('edit_from_dasboard')) {
          let discourse_id = searchParams.get('dasboard_discourseid_for_edit')
          const result = await axios.get(`${serverURl}/discourse/${discourse_id}`);
          setDiscourseName(result.data["discourse_name"])
          setDiscourse(result.data["sentences"])
          setDiscourseId(result.data["discourse_id"])
          setshowUSREditTable(true)
        }
      }
      fetchData();
    }
    catch (exception) {
      console.log(exception)
    }
  }, [serverURl])


  function renderUSRGenereateForm() {

    return (
      <form onSubmit={handleSubmit}>
        <div className="entry_components">
          <div className="tta1">
            <p className="lab_discourse">Discourse</p>
            <textarea id="sentences" name="discourse" type="text" value={discourse} onChange={handleDiscourseContent} ></textarea></div>
          <div className="tta2">
            <div className="label_discourse" ><p>Enter discourse name:</p></div>
            <input id="discourse_name" name="discourse_name" value={discourse_name} type="text" onChange={handleDiscourseName} />
          </div>
          {/* <div className="ttab2"><input type='button' name="Save Sentences"  value="Save discourse" disabled='True' /></div> */}
          <div className="ttab3">
            <input type='file' onChange={handleFileSelection} />
            {/* <input type='submit' name="Generate USR" onClick={saveChanges} value="USR Generate" disabled={!sentences} /> */}
            {/* <div className="ttab1"></div> */}
            <input type='button' name="Generate USR" value="USR Generate" disabled={!discourse} onClick={handleAutomaticGeneratedUSRs} />
          </div>
        </div>
      </form>
    );
  }

  function renderUSRContent() {

    const sentencesAttributes = {
      discourse,
      discourseid: discourseId
    };

    const usrAttributes = {
      showUSREditTable,
      discourseid: discourseId,
      receivedindex: receivedIndex,
      discoursename: discourse_name,
      receivedItem: receivedItem
    };

    return (
      <div className="frame_container">
        <Sentences {...sentencesAttributes} />
        <USR {...usrAttributes} />
      </div>
    );
  }

  return (
    <>
      {renderUSRGenereateForm()}
      {loading ? <CircularProgress sx={{ alignItems: 'center' }} color="secondary" /> : renderUSRContent()}
    </>
  )
};

export default USRgenerate;