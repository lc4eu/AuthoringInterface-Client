import React from 'react'
import Popup from 'reactjs-popup'
import { useState } from 'react';
import { Button } from '@mui/material';

const ConceptListPopup = ({ options, onSelect }) => {

    const handleOptionClick = (option) => {
        onSelect(option);
    };

    return (
        <div>
            <Popup trigger=
                {<a className="hover_text">Suggest Concept </a>}
                modal nested>
                {
                    close => (
                        <div className='modal'>
                            <div className='content'>
                                <h3>Choose an alternative Concept</h3>
                                {options.map((option, index) => (
                                    <li style={{ listStyle: 'none', cursor: 'pointer', boxShadow: ' -1px 1px 0px #B1B1B1', marginBottom: '2px' }} key={index} onClick={() => handleOptionClick(option)}>
                                        {option}
                                    </li>
                                ))}
                            </div>
                            <div>
                                <button style={{ marginTop: '5px' }} className="close_but" onClick=
                                    {() => close()}>
                                    Close
                                </button>
                            </div>
                        </div>
                    )
                }
            </Popup >
        </div >
    );
}

export default ConceptListPopup