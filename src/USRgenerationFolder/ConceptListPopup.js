import React from 'react'
import Popup from 'reactjs-popup'
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import customAxios from "../axios";
import messages from '../constants/messages';


const ConceptListPopup = ({ options, onSelect, conceptToBeSuggested }) => {

    const handleOptionClick = (option) => {
        onSelect(option);
    };
    const [conceptList, setConceptList] = useState([])

    // const suggestConcept = async (event) => {
    async function suggestConcept() {

        try {
            const params = {
                concept: conceptToBeSuggested
            };
            const result = await customAxios.post('/suggestedConcept', params);

            if (result.status === 200) {
                const newConceptList = { ...conceptList }
                for (var x = 0; x < result.data.length; x++) {
                    newConceptList[x] = result.data[x]
                }
                console.log(newConceptList)
                setConceptList(newConceptList)
                console.log(conceptList)
            }

            if (result.response?.status == 400) {
                return alert(messages.couldNotFetchConcepts)
            }
        }
        catch (exception) {
            console.log(exception)
        }
    }

    return (
        <div>
            <Popup trigger=
                {<a className="hover_text" onClick={suggestConcept} >Suggest Concept </a>}
                modal nested>
                {

                    close => (
                        <div className='modal'>
                            <div className='content'>
                                {/* {console.log(conceptToBeSuggested)} */}

                                <h3>Choose an alternative Concept</h3>
                                {options.map((option, index) => (
                                    // <a onClick={() => close()}>
                                    <li style={{ listStyle: 'none', cursor: 'pointer', boxShadow: ' -1px 1px 0px #B1B1B1', marginBottom: '2px' }} key={index} onClick={() => handleOptionClick(option['Concept'])}>
                                        {option['Concept'] + " : " + option['Meaning']}
                                    </li>
                                    // </a>
                                ))}
                            </div>
                            <button style={{ marginTop: '5px' }} className="close_but" onClick=
                                {() => close()}>
                                Close
                            </button>
                        </div>
                    )
                }
            </Popup >
        </div >
    );
}

export default ConceptListPopup