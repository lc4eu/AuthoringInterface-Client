import React from 'react'
import Popup from 'reactjs-popup'

const ConceptListPopup = ({ options, onSelect, indexOfConcept }) => {

    const handleOptionClick = (option, index) => {
        onSelect(option);
        index = indexOfConcept
        return
    };


    return (
        <div>
            <Popup trigger=
                {<div style={{ cursor: "pointer" }} className="hover_text" >Suggest Concept </div>}
                modal nested>
                {
                    close => (
                        <div className='modal'>
                            <div className='content'>
                                <h3>Choose an alternative Concept</h3>
                                {options.map((option, index) => (
                                    <a onClick={() => close()}>
                                        <li style={{ listStyle: 'none', cursor: 'pointer', boxShadow: ' -1px 1px 0px #B1B1B1', marginBottom: '2px' }} key={index} onClick={() => handleOptionClick(option['Concept'])}>
                                            {option['Concept'] + " : " + option['Meaning']}
                                        </li>
                                    </a>
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