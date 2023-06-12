import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import messages from '../constants/messages';
import customAxios from "../axios";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


const Sentences = (props) => {

  const { discourse, discourseid } = props;

  const [value_in_array, setValueInArray] = useState([]);
  const [page, setPage] = useState(1);
  const sentencesPerPage = 11;
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [usrsForSenteces, setUsrsForSenteces] = useState()

  const newusrsForSenteces = { ...usrsForSenteces }

  const getUsrForSentences = async () => {
    try {
      const result = await customAxios.get(`/usrs_for_a_discourse/${discourseid}`);
      if (result.status === 200) {
        for (var x = 0; x < result.data.length; x++) {
          newusrsForSenteces[x] = result.data[x]
        }
        console.log(newusrsForSenteces[0]['USR_ID'])
        console.log(newusrsForSenteces[0]['orignal_USR_json'])

      }

      if (result.response?.status === 400) {
        return alert(messages.somethingWentWrong);
      }
    }
    catch (exception) {
      console.log(exception)
    }
  };

  // useEffect(() => {
  //   getUsrForSentences();
  // }, [])


  useEffect(() => {
    try {
      const ending = /\।|\?|\||\./;

      let value_in_array = discourse.split(ending);
      setValueInArray(value_in_array.slice(0, -1));
    }
    catch (exception) {
      console.log(exception)
    }

  }, [discourse]);

  const handleClick = (index, item) => {
    setTimeout(() => {
      setHighlightedIndex(index);
      window.parent.postMessage({ index, item }, '*');
    }, 500);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(window.location)
  }

  const startIndex = (page - 1) * sentencesPerPage;
  const endIndex = startIndex + sentencesPerPage;
  const selectedSentences = value_in_array.slice(startIndex, endIndex);
  const pageCount = Math.ceil(value_in_array.length / sentencesPerPage);

  return (

    <div className='sentences_container'>
      <div className='sentences'>
        {selectedSentences.map((item, index) => (
          <p key={startIndex + index} style={{ backgroundColor: highlightedIndex === startIndex + index ? 'yellow' : 'white' }} onClick={event => handleClick(startIndex + index, item)}>
            {startIndex + index + 1}.
            {item}
            {/* <div class="idtooltip">{startIndex + index + 1}.
            <span class="idtooltiptext">{newusrsForSenteces[index]['USR_ID']}<ContentCopyIcon onClick={handleCopyToClipboard}></ContentCopyIcon></span>
          </div>
          <div class="tooltip">{item}
            <span class="tooltiptext"><ContentCopyIcon onClick={handleCopyToClipboard}></ContentCopyIcon><br></br>{newusrsForSenteces[index]['orignal_USR_json']}</span>
          </div> */}
          </p>
        ))}
      </div>

      <div className='alignPagination'>
        <Pagination count={pageCount} size="large" page={page} onChange={handleChangePage} />
      </div>
    </div>
  );
};

export default Sentences;