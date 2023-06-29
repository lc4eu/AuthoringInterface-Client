import React, { useEffect, useState } from 'react';
import './usr.css';
import axios from 'axios';
import customAxios from "../axios";
import messages from '../constants/messages';
import Button from '@mui/material/Button';
import ConceptListPopup from './ConceptListPopup';
import { listClasses } from '@mui/material';
import Popup from 'reactjs-popup';



const USR = () => {
  const [users, setUsers] = useState([])
  const [index, setIndex] = useState(0);
  const [selectedData, setSelectedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("in-edit");
  const [usrid, setUsrid] = useState('');
  const [discourseName, setDiscourseName] = useState("");
  const [receivedItem, setReceivedItem] = useState("");
  const [discourseId, setDiscourseId] = useState('');
  const [showUSREditTable, setshowUSREditTable] = useState(false);

  const [conceptListIndex, setConceptListIndex] = useState(null);

  const [nounsData, setNounsData] = useState([]);
  const [sentenceTData, setsentenceTData] = useState([]);
  const [speakersviewData, setspeakersviewData] = useState([]);
  const [depRelData, setDepRelData] = useState([]);

  let finalJson;
  let sentence_id = 0;
  let r_status;

  const serverURl = process.env.REACT_APP_API_BASE_URL;

  const viewTable = () => {
    setShowTable(true);
  }

  const saveChanges = async () => {
    try {
      let selectData = JSON.stringify(selectedData)
      let ss = selectData.replaceAll("\"", "'")

      const params = {
        finalJson: ss,
        usrid: usrid,
        discourseid: discourseId,
        author_id: localStorage.getItem("author_id")
      };

      const result = await customAxios.post('/editusr', params);

      if (result.status === 200) {
        alert(messages.savedSuccessfully);
        return window.location.reload();
      }

      if (result.response?.status === 400) {
        return alert(messages.somethingWentWrong);
      }
      alert(messages.somethingWentWrong);

      // fetch('editusr/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(body)
      // })
      //   .then(console.log(finalJson))
      //   .then(response => {
      //     alert("Saved Successfully")
      //   })
      //   .then(data => console.log(data))
      //   .catch(error => console.error(error));
      // window.location.reload();
    }
    catch (exception) {
      console.log(exception)
    }
  }

  const saveDownload = () => {
    try {
      saveChanges();
      const keys = Object.keys(selectedData);
      const values = keys.map(key => selectedData[key]);
      const formattedData = values.map(value => value.map(val => {
        if (typeof val === 'string') {
          return val.replace('/"', '');
        }
      }).join(',')).join('\n');
      const combinedData = "#" + receivedItem + '\n' + formattedData;
      const blob = new Blob([combinedData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = discourseName + "_" + index + ".txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    catch (exception) {
      console.log(exception)
    }
  }

  const submitForReview = () => {
    setReviewStatus("In Review");
    updateDatabase();
  };

  const updateDatabase = async () => {

    try {
      const params = {
        status: "In Review",
        usrid: usrid,
        author_id: localStorage.getItem("author_id")        // add other data required by the backend API
      };

      const result = await customAxios.post('/editstatus', params);

      if (result.status === 200) {
        return alert(messages.statusUpdatedSuccessfully);
      }

      if (result.response?.status === 400) {
        return alert(messages.failedToUpdateStatus);
      }
      // fetch('editstatus/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(body)
      // })
      //   .then(response => {
      //     if (response.ok) {
      //       alert("Status updated successfully");
      //     } else {
      //       alert("Failed to update status");
      //     }
      //   })
      //   .catch(error => {
      //     alert("Failed to update status: " + error);
      //   });
    }
    catch (exception) {
      console.log(exception)
    }
  };

  const addColumn = (indx) => {
    try {
      const shouldAdd = window.confirm('Are you sure you want to add a column?');
      if (shouldAdd) {
        const keys = Object.keys(selectedData);
        const values = keys.map(key => selectedData[key]);
        for (var i = 0; i < values.length - 2; i++) {
          values[i].splice(indx, 0, "")
        }
        const data = keys.reduce((obj, key, index) => {
          obj[key] = values[index];
          return obj;
        }, {});

        const json = JSON.stringify(data);
        setSelectedData(json)
        saveChanges();
      }
    }
    catch (exception) {
      console.log(exception)
    }
  }

  const deleteConcept = (indx) => {
    try {
      const shouldDelete = window.confirm('Are you sure you want to delete this column?');
      if (shouldDelete) {
        const keys = Object.keys(selectedData);
        const values = keys.map(key => selectedData[key]);
        for (var i = 0; i < values.length - 2; i++) {
          values[i].splice(indx, 1)
        }
        const data = keys.reduce((obj, key, index) => {
          obj[key] = values[index];
          return obj;
        }, {});

        const json = JSON.stringify(data);
        setSelectedData(json)
        saveChanges();
      }
    }
    catch (exception) {
      console.log(exception)
    }
  }

  function showConceptList(index) {
    setConceptListIndex(index);
  }

  function closeConceptList() {
    setConceptListIndex(null);
  }

  const handleChange = (event, key, index) => {
    try {
      const newSelectedData = { ...selectedData };
      newSelectedData[key][index] = event.target.value;
      setSelectedData(newSelectedData);
    }
    catch (exception) {
      console.log(exception)
    }
  };

  const showUSRData = async () => {
    try {
      const result = await customAxios.get(`/orignal_usr_fetch/${discourseId}`);
      if (result.status === 200) {
        const usr_data = result.data
        setUsers(usr_data)
        const usr_result = usr_data
        finalJson = usr_result
        // console.log("indexjbfd", index)
        const orobj = usr_result[index].edited_usr.replaceAll("'", "\"")
        r_status = usr_result[index].status
        setUsrid(usr_result[index].usr_id);
        const orignal_usr_json = JSON.parse(orobj);
        setSelectedData(orignal_usr_json);
        setLoading(false);
        finalJson = usr_result[index].edited_usr
        setReviewStatus(r_status);
      }

      if (result.response?.status === 400) {
        return alert(messages.somethingWentWrong);
      }
    }
    catch (exception) {
      console.log(exception)
    }
  }

  useEffect(() => {
    try {
      if (showUSREditTable) {
        showUSRData();
        setshowUSREditTable(false)
      }
    }
    catch (exception) {
      console.log(exception)
    }
  }, [showUSRData, showUSREditTable])


  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          const result = await axios.get(`${serverURl}/semcateofnouns`);
          setNounsData(result.data);
        } catch (error) {
          console.error(error.message);
        }
      }
      fetchData();
    }
    catch (exception) {
      console.log(exception)
    }
  }, [serverURl])

  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          const result = await axios.get(`${serverURl}/deprelation`);
          setDepRelData(result.data);
        } catch (error) {
          console.error(error.message);
        }
      }
      fetchData();
    }
    catch (exception) {
      console.log(exception)
    }
  }, [serverURl])

  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          const result = await axios.get(`${serverURl}/sentencetype`);
          setsentenceTData(result.data);
        } catch (error) {
          console.error(error.message);
        }
      }
      fetchData();
    }
    catch (exception) {
      console.log(exception)
    }
  }, [serverURl])

  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          const result = await axios.get(`${serverURl}/speakersview`);
          setspeakersviewData(result.data);
        } catch (error) {
          console.error(error.message);
        }
      }
      fetchData();
    }
    catch (exception) {
      console.log(exception)
    }
  }, [serverURl])

  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          const searchParams = new URLSearchParams(window.location.search);
          setDiscourseName(searchParams.get('discoursename'))
          setDiscourseId(searchParams.get('discourseid'))
          setshowUSREditTable(searchParams.get('showUSREditTable'))
          setReceivedItem(searchParams.get('receivedItem'))
          const receivedIndex = searchParams.get("receivedindex") || 0;
          setIndex(receivedIndex ? receivedIndex : 0);
        } catch (error) {
          console.error(error.message);
        }
      }
      fetchData();
    }
    catch (exception) {
      console.log(exception)
    }
  }, [index]);


  const [conceptList, setConceptList] = useState([])
  const newConceptList = [
    { "Concept": "kuCa_1", "Meaning": "some_2" },
    { "Concept": "kuCa_2", "Meaning": "few_5" },
    { "Concept": "kuCa_3", "Meaning": "something_1" },
    { "Concept": "kuCa_4", "Meaning": "money_11" },
    { "Concept": "kuCa_5", "Meaning": "somewhat_5" },
    { "Concept": "kuCa_6", "Meaning": "something_1" },
    { "Concept": "kuCa_7", "Meaning": "little_1" },
    { "Concept": "kuCa_8", "Meaning": "slight_12" }
  ]


  const suggestConcept = async (index) => {
    try {
      const params = {
        concept: selectedData["Concept"][index]
      };
      const result = await customAxios.post('/suggestedConcept', params);

      if (result.status === 200) {

        for (var x = 0; x < result.data.length; x++) {
          newConceptList[x] = result.data[x]
        }
        console.log(newConceptList)
        setConceptList(newConceptList)
        console.log(conceptList)
      }

      if (result.response?.status === 400) {
        return alert(messages.couldNotFetchConcepts)
      }
    }
    catch (exception) {
      console.log(exception)
    }
  }


  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectOption = (option, index) => {
    setSelectedOption(option);
    console.log(index)
    const shouldChangeConcept = window.confirm('Are you sure you want to choose this concept?');
    if (shouldChangeConcept) {
      const newSelectedData = { ...selectedData };
      newSelectedData["Concept"][0] = selectedOption;
      setSelectedData(newSelectedData);
    }
  };

  const handleConceptList = (concept_List) => {
    setConceptList(concept_List)
  }

  function handleConceptSelect(concept, index) {
    const newData = { ...selectedData }
    newData["Concept"][index] = concept
    console.log(newData["Concept"], index);
    setSelectedData(newData)
    closeConceptList();
  }

  function renderConceptList() {

    if (conceptListIndex === null) {
      return;
    }

    const conceptListPopupAttributes = {
      open: true,
      data: selectedData,
      index: conceptListIndex,
      onClose: closeConceptList,
      onSelect: handleConceptSelect
    };

    return <ConceptListPopup {...conceptListPopupAttributes} />;
  }

  return (
    loading ? <div>Loading...</div> :
      <>
        <div className="usrBtnControls">
          <Button sx={{ margin: '5px' }} variant="contained" onClick={viewTable} disabled={reviewStatus === "In Review"}>Edit</Button>
          <Button sx={{ margin: '5px' }} variant="contained" onClick={() => saveChanges()} disabled={reviewStatus === "In Review"}>Save</Button>
          <Button sx={{ margin: '5px' }} variant="contained" onClick={saveDownload}>Save & Download</Button>
          <Button sx={{ margin: '5px' }} variant="contained" onClick={submitForReview} disabled={reviewStatus === "In Review"}>Submit for Review</Button>
          <br></br><label htmlFor="status">Status:</label><input type="text" id="status" value={reviewStatus} readOnly />
        </div>

        {showTable && Object.keys(selectedData).length > 0 ? (
          <form>
            <table >
              <tbody>
                <tr >
                  <div className='headerdiv'></div>
                  {
                    selectedData.Concept.map((item, i) => {
                      return <td key={i}><Button sx={{ margin: '5px' }} variant="contained" onClick={() => addColumn(i)}>Add a concept</Button></td>
                    })
                  }

                </tr>
                <tr >
                  <div className='headerdiv'></div>
                  {
                    selectedData.Concept.map((item, i) => {
                      return <td key={i}><Button sx={{ margin: '5px' }} variant="contained" onClick={() => deleteConcept(i)}>Delete concept</Button></td>
                    })
                  }
                </tr>

                <tr >
                  <div className='headerdiv'></div>
                  {
                    selectedData.Concept.map((item, index) => (
                      <td key={index}>
                        <Button sx={{ margin: '5px' }} variant="contained" onClick={() => showConceptList(index)}>Suggest concept</Button>
                      </td>
                    ))
                  }
                  {/* {
                    selectedData.Concept.map((item, i) => {
                      return (<td key={i}>
                        <ConceptListPopup
                          // options={() => suggestConcept(i)}
                          options={newConceptList}
                          onSelect={handleSelectOption}
                          // onSelect={(event) => suggestConcept(event, i)}
                          indexOfConcept={i}
                        />
                      </td>)
                    })
                  } */}
                </tr>

                <tr>
                  <th className='headerdiv'>Concept</th>
                  {
                    selectedData.Concept.map((item, i) => {
                      return <td><div className="headerdiv2"><input type="text" value={item} onChange={(event) => handleChange(event, 'Concept', i)} /></div></td>
                    }

                    )
                  }
                </tr>

                <tr>
                  <th className='headerdiv'>Index</th>
                  {
                    Array.from({ length: selectedData.Concept.length }, (_, i) => i + 1).map((item, i) => {
                      return <td><div className="headerdiv2"><input type='text' value={item} onChange={(event) => handleChange(event, 'Index', i)} disabled='True' /></div></td>
                    })
                  }
                </tr>

                <tr>
                  <th className='headerdiv'>Sem. Cat</th>
                  {
                    selectedData.SemCateOfNouns.map((item, i) => {
                      return (
                        <td>
                          <div className="headerdiv2">
                            <select
                              value={item}
                              onChange={(event) => handleChange(event, 'SemCateOfNouns', i)}
                            >
                              <option value="" selected={item === ''}></option>
                              {nounsData.map((option) => (
                                <option key={option.id} value={option.scn_value} selected={item === option.scn_value} title={option.scn_title}>
                                  {option.scn_value}
                                </option>
                              ))}

                            </select>
                          </div>
                        </td>
                      );
                    })
                  }
                </tr>

                <tr>
                  <th className='headerdiv'>G-N-P</th>
                  {
                    selectedData.GNP.map((item, i) => {
                      return <td><div className="headerdiv2"><input type='text' value={item} onChange={(event) => handleChange(event, 'GNP', i)} /></div></td>
                    }

                    )

                  }
                </tr>

                <tr>
                  <th className='headerdiv'>Dep-Rel</th>
                  {
                    selectedData.DepRel.map((item, i) => {
                      const [dep_index, option] = item.split(":"); // split the item into index and option
                      return (
                        <td>
                          <div className="headerdiv2">
                            <select
                              className="usr_index_option"
                              value={dep_index}
                              onChange={(event) => {
                                const new_dep_index = event.target.value;
                                const newDepRel = [...selectedData.DepRel];
                                newDepRel[i] = `${new_dep_index}:${option}`;
                                setSelectedData({ ...selectedData, DepRel: newDepRel });
                              }}
                            >
                              <option value="0" selected={Number(dep_index) === 0}>0</option>
                              {
                                Array.from({ length: selectedData.Concept.length }, (_, j) => j + 1).map((num) => (
                                  <option key={`index_${num}`} value={`${num}`} selected={num === Number(dep_index)}
                                  >
                                    {num}
                                  </option>
                                ))
                              }
                            </select>
                            <select value={option}
                              onChange={(event) => {
                                const newOption = event.target.value;
                                const newDepRel = [...selectedData.DepRel];
                                newDepRel[i] = `${dep_index}:${newOption}`;
                                setSelectedData({ ...selectedData, DepRel: newDepRel });
                              }}>
                              <option value="" selected={item === ''}></option>
                              {depRelData.map((option) => (
                                <option key={option.dpr_id} value={option.dpr_value} selected={item === option.dpr_value} title={option.dpr_title}>
                                  {option.dpr_value}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      );
                    })
                  }
                </tr>

                <tr>
                  <th className='headerdiv'>Discourse</th>
                  {
                    selectedData.Discourse.map((item, i) => {
                      return <td><div className="headerdiv2"><input type='text' value={item} onChange={(event) => handleChange(event, 'Discourse', i)} /></div></td>
                    }

                    )
                  }
                </tr>

                <tr>
                  <th className='headerdiv'>Speaker's View</th>
                  {
                    selectedData.SpeakersView.map((item, i) => {
                      return (
                        <td>
                          <div className="headerdiv2">
                            <select
                              value={item}
                              onChange={(event) => handleChange(event, 'SpeakersView', i)}
                            >
                              <option value="" selected={item === ''}></option>
                              {speakersviewData.map((option) => (
                                <option key={option.spv_id} value={option.spv_value} selected={item === option.spv_value} title={option.spv_title}>
                                  {option.spv_value}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      );



                    }

                    )
                  }
                </tr>

                <tr>
                  <th className='headerdiv'>Scope</th>
                  {
                    selectedData.Scope.map((item, i) => {
                      return <td><div className="headerdiv2"><input type='text' value={item} onChange={(event) => handleChange(event, 'Scope', i)} /></div></td>
                    }

                    )
                  }
                </tr>

                <tr>
                  <th className='headerdiv'>Sentence Type</th>
                  {
                    selectedData.SentenceType.map((item, i) => {
                      return (
                        <td colSpan={selectedData.Concept.length}>
                          <div className="headerdiv2">
                            <select value={item} onChange={(event) => handleChange(event, 'SentenceType', i)}>
                              <option value="" selected={item === ''}></option>
                              {sentenceTData.map((option) => (
                                <option key={option.sen_id} value={option.sen_value} selected={item === option.sen_value} >
                                  {option.sen_value}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      )
                    })
                  }
                </tr>

                <tr>
                  <th className='headerdiv'>Construction</th>
                  {
                    selectedData.Construction.map((item, i) => {
                      return <td colSpan={selectedData.Concept.length}><div className="headerdiv2"><input type='text' value={item} onChange={(event) => handleChange(event, 'Construction', i)} /></div></td>
                    }

                    )
                  }
                </tr>
              </tbody>
            </table>
          </form >
        ) : (

          <table>
            <tbody>
              <tr>
                <th className='headerdiv'>Concept</th>
                {
                  selectedData.Concept.map((item, i) => {
                    return <td><div className="headerdiv2">{item}</div></td>
                  }

                  )
                }
              </tr>

              <tr>
                <th className='headerdiv'>Index</th>
                {
                  Array.from({ length: selectedData.Concept.length }, (_, i) => i + 1).map((item, i) => {
                    return <td><div className="headerdiv2">{item}</div></td>
                  })
                }
              </tr>

              <tr>
                <th className='headerdiv'>Sem. Cat</th>
                {
                  selectedData.SemCateOfNouns.map((item, i) => {
                    return <td><div className="headerdiv2">{item}</div></td>
                  }

                  )
                }
              </tr>

              <tr>
                <th className='headerdiv'>G-N-P</th>
                {
                  selectedData.GNP.map((item, i) => {
                    return <td><div className="headerdiv2">{item}</div></td>
                  }

                  )
                }
              </tr>

              <tr>
                <th className='headerdiv'>Dep-Rel</th>
                {
                  selectedData.DepRel.map((item, i) => {
                    return <td><div className="headerdiv2">{item}</div></td>
                  }

                  )
                }
              </tr>

              <tr>
                <th className='headerdiv'>Discourse</th>
                {
                  selectedData.Discourse.map((item, i) => {
                    return <td><div className="headerdiv2">{item}</div></td>
                  }

                  )
                }
              </tr>

              <tr>
                <th className='headerdiv'>Speaker's View</th>
                {
                  selectedData.SpeakersView.map((item, i) => {
                    return <td><div className="headerdiv2">{item}</div></td>
                  }

                  )
                }
              </tr>

              <tr>
                <th className='headerdiv'>Scope</th>
                {
                  selectedData.Scope.map((item, i) => {
                    return <td><div className="headerdiv2">{item}</div></td>
                  }

                  )
                }
              </tr>

              <tr>
                <th className='headerdiv'>Sentence Type</th>
                {
                  selectedData.SentenceType.map((item, i) => {
                    return <td colSpan={selectedData.Concept.length}><div className="headerdiv2">{item}</div></td>
                  }

                  )
                }
              </tr>

              <tr>
                <th className='headerdiv'>Construction</th>
                {
                  selectedData.Construction.map((item, i) => {
                    return <td colSpan={selectedData.Concept.length}><div className="headerdiv2">{item}</div></td>
                  }

                  )
                }
              </tr>
            </tbody>
          </table>
        )
        }
        {renderConceptList()}
      </>
  )
};

export default USR;