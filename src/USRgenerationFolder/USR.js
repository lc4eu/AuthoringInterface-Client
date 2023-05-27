import React, { useEffect, useState } from 'react';
import './usr.css';
import axios from 'axios';
//import cjson from 'cjson';

import Button from '@mui/material/Button';
import { FaPlusCircle } from 'react-icons/fa';


const USR = () => {
  const [index, setIndex] = useState(0);
  const [selectedData, setSelectedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("in-edit");
  const [usrid, setUsrid] = useState('');
  const [discourseName, setDiscourseName] = useState("");
  const [receivedItem, setReceivedItem] = useState("");

  const [nounsData, setNounsData] = useState([]);
  const [speakersData, setSpeakersData] = useState([]);

  let finalJson;
  let sentence_id = 0;
  let r_status;

  const handleChange = (event, key, index) => {
    const newSelectedData = { ...selectedData };
    newSelectedData[key][index] = event.target.value;
    setSelectedData(newSelectedData);
    console.log(newSelectedData)
  };


  const [users, setUsers] = useState([])


  const fetchData = () => {
    fetch(`/api/orignal_usr_fetch/`)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setUsers(data)
        const result = data
        finalJson = result
        const orobj = result[index].edited_usr.replaceAll("'", "\"")
        r_status = result[index].status
        setUsrid(result[index].usr_id);
        console.log(usrid)
        console.log(orobj)
        const orignal_usr_json = JSON.parse(orobj);
        setSelectedData(orignal_usr_json);
        //setSelectedData(result[index].orignal_usr_json);
        setLoading(false);
        finalJson = result[index].edited_usr
        // finalJson=String(result[index].orignal_usr_json.replaceAll("\"", "'"));
        console.log("hiiii")
        console.log(typeof finalJson)
        setReviewStatus(r_status);
      })
  }

  useEffect(() => {
    axios.get('semcateofnouns/')
      .then(response => setNounsData(response.data))
      .catch(error => console.log(error));
    fetchData()
  }, [index])


  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setDiscourseName(searchParams.get('discoursename'))
    setReceivedItem(searchParams.get('receivedItem'))
    const receivedIndex = searchParams.get("receivedindex") || 0;
    setIndex(receivedIndex ? receivedIndex : 0);
  }, [index]);

  const viewTable = () => {
    setShowTable(true);
  }

  const saveChanges = () => {
    let selectData = JSON.stringify(selectedData)
    let ss = selectData.replaceAll("\"", "'")
    console.log("Hi")
    console.log(usrid)

    // console.log(selectedData)
    // const jsonString = JSON.stringify(ss)
    const body = {
      finalJson: ss,
      usrid: usrid
    };
    fetch('editusr/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(console.log(finalJson))
      .then(response => {
        alert("Saved Successfully")
      })
      .then(data => console.log(data))
      .catch(error => console.error(error));
    window.location.reload();
  }



  const submitForReview = () => {
    setReviewStatus("In Review");
    updateDatabase();
  };

  const updateDatabase = () => {
    const body = {
      status: "In Review",
      usrid: usrid
      // add other data required by the backend API
    };
    fetch('editstatus/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (response.ok) {
          alert("Status updated successfully");
        } else {
          alert("Failed to update status");
        }
      })
      .catch(error => {
        alert("Failed to update status: " + error);
      });
  };


  const saveDownload = () => {
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


  const addColumn = (indx) => {
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
      console.log(json)
      setSelectedData(json)
      saveChanges();
    }
  }

  const deleteConcept = (indx) => {
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
      console.log(json)
      setSelectedData(json)
      saveChanges();
    }
  }

  return (


    loading ? <div>Loading...</div> :

      <>
        <div className="usrBtnControls">
          {/* <input type="submit" className="usrEditButton" onClick={viewTable} value="Edit" />
 <input type="submit" className="usrEditButton" onClick={saveChanges} value="Save" />
 <input type="submit" className="usr_rev_Button" value="Submit for review" />
 <input type="text" value="In Edit" readonly/> */}
          <Button sx={{ margin: '5px' }} variant="contained" onClick={viewTable} disabled={reviewStatus === "In Review"}>Edit</Button>
          <Button sx={{ margin: '5px' }} variant="contained" onClick={() => saveChanges()} disabled={reviewStatus === "In Review"}>Save</Button>
          <Button sx={{ margin: '5px' }} variant="contained" onClick={saveDownload}>Save & Download</Button>
          <Button sx={{ margin: '5px' }} variant="contained" onClick={submitForReview} disabled={reviewStatus === "In Review"}>Submit for Review</Button>
          <br></br><label htmlFor="status">Status:</label><input type="text" id="status" value={reviewStatus} readOnly />

        </div>

        {showTable && Object.keys(selectedData).length > 0 ? (
          <form>
            <table >
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

              <tr>
                <div className='headerdiv'><th>Concept</th></div>
                {
                  selectedData.Concept.map((item, i) => {
                    return <td><div className="headerdiv2"><input type="text" value={item} onChange={(event) => handleChange(event, 'Concept', i)} /></div></td>
                  }

                  )
                }
              </tr>

              <tr>
                <div className='headerdiv'><th>Index</th></div>
                {
                  Array.from({ length: selectedData.Concept.length }, (_, i) => i + 1).map((item, i) => {
                    return <td><div className="headerdiv2"><input type='text' value={item} onChange={(event) => handleChange(event, 'Index', i)} disabled='True' /></div></td>
                  })
                }
              </tr>



              {/* <tr>
 <div className='headerdiv'><th>Index</th></div>
 {
 selectedData.Index.map((item,i) => {
 return <td><div className="headerdiv2"><input type='text' value={item} onChange={(event) => handleChange(event, 'Index', i)} disabled='True'/></div></td>
 }
 
 )
 }
 </tr> */}
              <tr>
                <div className='headerdiv'><th>Sem. Cat</th></div>
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
                            <option value="anim" title="Animacy">anim</option>
                            <option value="per" selected={item === 'per'} title="Person">per</option>
                            <option value="org" selected={item === 'org'} title="Organization">org</option>
                            <option value="mass" selected={item === 'mass'} title="Mass">mass</option>
                            <option value="abs" selected={item === 'abs'} title="Abstract">abs</option>
                            <option value="place" selected={item === 'place'} title="Place">place</option>
                            <option value="dow" selected={item === 'dow'} title="Day of week">dow</option>
                            <option value="moy" selected={item === 'moy'} title="Month of year">moy</option>
                            <option value="yoc" selected={item === 'yoc'} title="Year of Century">yoc</option>
                            <option value="ne" selected={item === 'ne'} title="Names of movies, medicine, cuisine, games, disease">ne</option>

                          </select>
                        </div>
                      </td>
                    );
                  })
                }
              </tr>
              <tr>
                <div className='headerdiv'><th>G-N-P</th></div>
                {
                  selectedData.GNP.map((item, i) => {
                    return <td><div className="headerdiv2"><input type='text' value={item} onChange={(event) => handleChange(event, 'GNP', i)} /></div></td>
                  }

                  )

                }
              </tr>
              {/* <tr>
 <div className='headerdiv'><th>Dep-Rel</th></div>
 {
 selectedData.DepRel.map((item,i) => {
 return <td><div className="headerdiv2"><input type='text' value={item} onChange={(event) => handleChange(event, 'DepRel', i)}/></div></td>
 }
 
 )
 }
 </tr> */}


              <tr>
                <div className='headerdiv'><th>Dep-Rel</th></div>
                {
                  selectedData.DepRel.map((item, i) => {
                    const [dep_index, option] = item.split(":"); // split the item into index and option
                    return (
                      <td>
                        <div className="headerdiv2">
                          <select
                            class="usr_index_option"
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
                            <option key="option_main" value="main" selected={option === "main"}>main</option>
                            <option key="option_k1" value="k1" selected={option === "k1"}>kartaa(k1)</option>
                            <option key="option_k2" value="k2" selected={option === "k2"}>k2</option>
                            <option key="option_k3" value="k3" selected={option === "k3"}>k3</option>
                            <option key="option_k4" value="k4" selected={option === "k4"}>k4</option>
                            <option key="option_k5" value="k5" selected={option === "k5"}>k5</option>
                            <option key="option_k7" value="k7" selected={option === "k7"}>k7</option>
                            <option key="option_k1s" value="k1s" selected={option === "k1s"}>k1s</option>
                            <option key="option_neg" value="neg" selected={option === "neg"}>neg</option>
                            <option key="option_card" value="card" selected={option === "card"}>Cardinals(card)</option>
                            <option key="option_ord" value="ord" selected={option === "ord"}>Ordinals(ord)</option>
                            <option key="option_mod" value="mod" selected={option === "mod"}>Quality(mod)</option>
                            <option key="option_krvn" value="krvn" selected={option === "krvn"}>krvn</option>
                            <option key="option_rpk" value="rpk" selected={option === "rpk"}>rpk</option>
                            <option key="option_rblak" value="rblak" selected={option === "rblak"}>rblak</option>
                            <option key="option_rblpk" value="rblpk" selected={option === "rblpk"}>rblpk</option>
                            <option key="option_k7p" value="k7p" selected={option === "k7p"}>k7p</option>
                            <option key="option_k7t" value="k7t" selected={option === "k7t"}>k7t</option>
                            <option key="option_rsm" value="rsm" selected={option === "rsm"}>rsm</option>
                            <option key="option_rsma" value="rsma" selected={option === "rsma"}>rsma</option>
                            <option key="option_rsk" value="rsk" selected={option === "rsk"}>rsk</option>
                            <option key="option_rpk" value="rpk" selected={option === "rpk"}>rpk</option>
                            <option key="option_rhh" value="rhh" selected={option === "rhh"}>rhh</option>
                            <option key="option_ord" value="ord" selected={option === "ord"}>ord</option>
                            <option key="option_rblsk" value="rblsk" selected={option === "rblsk"}>rblsk</option>
                            <option key="option_ru" value="ru" selected={option === "ru"}>ru</option>
                            <option key="option_rv" value="rv" selected={option === "rv"}>rv</option>
                            <option key="option_rkl" value="rkl" selected={option === "rkl"}>rkl</option>
                            <option key="option_rdl" value="rdl" selected={option === "rdl"}>rdl</option>
                            <option key="option_rd" value="rd" selected={option === "rd"}>rd</option>
                            <option key="option_rvks" value="rvks" selected={option === "rvks"}>rvks</option>
                            <option key="option_rbks" value="rbks" selected={option === "rbks"}>rbks</option>
                            <option key="option_pk1" value="pk1" selected={option === "pk1"}>pk1</option>
                            <option key="option_jk1" value="jk1" selected={option === "jk1"}>jk1</option>
                            <option key="option_mk1" value="mk1" selected={option === "mk1"}>mk1</option>
                            <option key="option_k2g" value="k2g" selected={option === "k2g"}>k2g</option>
                            <option key="option_k2s" value="k2s" selected={option === "k2s"}>k2s</option>
                            <option key="option_k2p" value="k2p" selected={option === "k2p"}>k2p</option>
                            <option key="option_k4a" value="k4a" selected={option === "k4a"}>k4a</option>
                            <option key="option_k5prk" value="k5prk" selected={option === "k5prk"}>k5prk</option>
                            <option key="option_r6" value="r6" selected={option === "r6"}>r6</option>
                            <option key="option_quant" value="quant" selected={option === "quant"}>quant</option>
                            <option key="option_dem" value="dem" selected={option === "dem"}>dem</option>
                            <option key="option_intf" value="intf" selected={option === "intf"}>intf</option>
                            <option key="option_re" value="re" selected={option === "re"}>re</option>
                            <option key="option_vk2" value="vk2" selected={option === "vk2"}>vk2</option>
                          </select>
                        </div>
                      </td>
                    );
                  })
                }
              </tr>


              <tr>
                <div className='headerdiv'><th>Discourse</th></div>
                {
                  selectedData.Discourse.map((item, i) => {
                    return <td><div className="headerdiv2"><input type='text' value={item} onChange={(event) => handleChange(event, 'Discourse', i)} /></div></td>
                  }

                  )
                }
              </tr>
              <tr>
                <div className='headerdiv'><th>Speaker's View</th></div>
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
                            <option value="respect" selected={item === 'respect'}>respect</option>
                            <option value="def" selected={item === 'def'} title="definiteness">def</option>
                            <option value="deic" selected={item === 'deic'} title="deicticity">deic</option>
                            <option value="RPs" selected={item === 'RPs'} title="Relation particles or discourse particles">RPs</option>
                            <option value="shdxe" selected={item === 'shdxe'} title="shadexe">[shade: xe_1]</option>
                            <option value="shdle" selected={item === 'shdle'} title="shadele">[shade: le_1]</option>
                            <option value="shdjA" selected={item === 'shdjA'} title="shadejA">[shade: jA_1]</option>
                          </select>
                        </div>
                      </td>
                    );



                  }

                  )
                }
              </tr>
              <tr>
                <div className='headerdiv'><th>Scope</th></div>
                {
                  selectedData.Scope.map((item, i) => {
                    return <td><div className="headerdiv2"><input type='text' value={item} onChange={(event) => handleChange(event, 'Scope', i)} /></div></td>
                  }

                  )
                }
              </tr>
              <tr>
                <div className='headerdiv'><th>Sentence Type</th></div>
                {
                  selectedData.SentenceType.map((item, i) => {
                    return (
                      <td colSpan={selectedData.Concept.length}>
                        <div className="headerdiv2">
                          <select value={item} onChange={(event) => handleChange(event, 'SentenceType', i)}>
                            <option value="" selected={item === ''}></option>
                            <option value="negative" selected={item === 'negative'}>negative</option>
                            <option value="affirmative" selected={item === 'affirmative'}>affirmative</option>
                            <option value="interrogative" selected={item === 'interrogative'}>interrogative</option>
                            <option value="yn_interrogative" selected={item === 'yn_interrogative'}>yn_interrogative</option>
                            <option value="imperative" selected={item === 'imperative'}>imperative</option>
                            <option value="pass-affirmative" selected={item === 'pass-affirmative'}>pass-affirmative</option>
                            <option value="pass-interrogative" selected={item === 'pass-interrogative'}>pass-interrogative</option>
                          </select>
                        </div>
                      </td>
                    )
                  }

                  )
                }
              </tr>

              <tr>
                <div className='headerdiv'><th>Construction</th></div>
                {
                  selectedData.Construction.map((item, i) => {
                    return <td colSpan={selectedData.Concept.length}><div className="headerdiv2"><input type='text' value={item} onChange={(event) => handleChange(event, 'Construction', i)} /></div></td>
                  }

                  )
                }
              </tr>
            </table>
          </form >
        ) :

          <table>
            <tr>
              <div className='headerdiv'><th>Concept</th></div>
              {
                selectedData.Concept.map((item, i) => {
                  return <td><div className="headerdiv2">{item}</div></td>
                }

                )
              }
            </tr>
            {/* <tr>
 <div className='headerdiv'><th>Index</th></div>
 {
 selectedData.Index.map((item,i) => {
 return <td><div className="headerdiv2">{item}</div></td>
 }
 
 )
 }
 </tr> */}
            <tr>
              <div className='headerdiv'><th>Index</th></div>
              {
                Array.from({ length: selectedData.Concept.length }, (_, i) => i + 1).map((item, i) => {
                  return <td><div className="headerdiv2">{item}</div></td>
                })
              }
            </tr>
            <tr>
              <div className='headerdiv'><th>Sem. Cat</th></div>
              {
                selectedData.SemCateOfNouns.map((item, i) => {
                  return <td><div className="headerdiv2">{item}</div></td>
                }

                )
              }
            </tr>
            <tr>
              <div className='headerdiv'><th>G-N-P</th></div>
              {
                selectedData.GNP.map((item, i) => {
                  return <td><div className="headerdiv2">{item}</div></td>
                }

                )
              }
            </tr>
            <tr>
              <div className='headerdiv'><th>Dep-Rel</th></div>
              {
                selectedData.DepRel.map((item, i) => {
                  return <td><div className="headerdiv2">{item}</div></td>
                }

                )
              }
            </tr>
            <tr>
              <div className='headerdiv'><th>Discourse</th></div>
              {
                selectedData.Discourse.map((item, i) => {
                  return <td><div className="headerdiv2">{item}</div></td>
                }

                )
              }
            </tr>
            <tr>
              <div className='headerdiv'><th>Speaker's View</th></div>
              {
                selectedData.SpeakersView.map((item, i) => {
                  return <td><div className="headerdiv2">{item}</div></td>
                }

                )
              }
            </tr>
            <tr>
              <div className='headerdiv'><th>Scope</th></div>
              {
                selectedData.Scope.map((item, i) => {
                  return <td><div className="headerdiv2">{item}</div></td>
                }

                )
              }
            </tr>
            <tr>
              <div className='headerdiv'><th>Sentence Type</th></div>
              {
                selectedData.SentenceType.map((item, i) => {
                  return <td colSpan={selectedData.Concept.length}><div className="headerdiv2">{item}</div></td>
                }

                )
              }
            </tr>
            <tr>
              <div className='headerdiv'><th>Construction</th></div>
              {
                selectedData.Construction.map((item, i) => {
                  return <td colSpan={selectedData.Concept.length}><div className="headerdiv2">{item}</div></td>
                }

                )
              }
            </tr>
          </table>

        }
      </>



  )
};

export default USR;