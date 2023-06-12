import React, { useEffect, useState } from 'react'
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
    );
}

export default ConceptListPopup