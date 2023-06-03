import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup'
import {
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle
} from '@mui/material';
import customAxios from "../axios";
import messages from '../constants/messages';

const ConceptListPopup = (props) => {

    const { open, data, index, onClose, onSelect } = props;

    const [conceptList, setConceptList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSuggestedConcept();;
    }, []);

    const loadSuggestedConcept = async () => {
        try {
            setLoading(true);
            const params = {
                concept: data["Concept"][index]
            };
            const result = await customAxios.post('/suggestedConcept', params);

            if (result.status === 200) {
                setConceptList(result.data)
            }
            setLoading(false);
            if (result.response?.status === 400) {
                return alert(messages.couldNotFetchConcepts)
            }
        }
        catch (exception) {
            setLoading(false);
            console.log(exception)
        }
    }

    function renderConceptList() {

        if (loading === true) {
            return <CircularProgress color="secondary" />;
        }

        return (
            <>
                {
                    conceptList.map((concept, _index) => (
                        <div key={_index} onClick={() => onSelect(concept['Concept'], index)}>{concept['Concept'] + " : " + concept['Meaning']}</div>
                    ))
                }
            </>
        );
    }


    return (
        <Dialog open={open} maxWidth='lg' onClose={onClose}>
            <DialogTitle>Choose an alternative concept</DialogTitle>
            <DialogContent>
                {renderConceptList()}
                <Button sx={{ margin: '5px' }} variant="contained" onClick={onClose}>Close</Button>
            </DialogContent>
        </Dialog>
        // <div>
        //     <Popup trigger=
        //         {<div style={{ cursor: "pointer" }} className="hover_text" >Suggest Concept </div>}
        //         modal nested>
        //         {
        //             close => (
        //                 <div className='modal'>
        //                     <div className='content'>
        //                         <h3>Choose an alternative Concept</h3>
        //                         {options.map((option, index) => (
        //                             <a onClick={() => close()}>
        //                                 <li style={{ listStyle: 'none', cursor: 'pointer', boxShadow: ' -1px 1px 0px #B1B1B1', marginBottom: '2px' }} key={index} onClick={() => handleOptionClick(option['Concept'])}>
        //                                     {option['Concept'] + " : " + option['Meaning']}
        //                                 </li>
        //                             </a>
        //                         ))}
        //                     </div>
        //                     <button style={{ marginTop: '5px' }} className="close_but" onClick=
        //                         {() => close()}>
        //                         Close
        //                     </button>
        //                 </div>
        //             )
        //         }
        //     </Popup >
        // </div >
    );
}

export default ConceptListPopup