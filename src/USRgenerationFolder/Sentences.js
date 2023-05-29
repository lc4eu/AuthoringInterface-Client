import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';


const Sentences = () => {
  const [value_in_array, setValueInArray] = useState([]);
  const [page, setPage] = useState(1);
  const sentencesPerPage = 11;
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [number, setNumber] = useState(0);
  // const [usrs, setUsrs] = useState()

  // const searchParams = new URLSearchParams(window.location.search);
  // const d_id = searchParams.get('discourse_id');

  // useEffect(() => {
  //   axios.get('/specific_usrs/')
  //     .then(response => setUsrs(response.data))
  //     .catch(error => console.log(error));
  // }, [])


  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const sentence = searchParams.get('discourse');
      // const ending = /(?<=[।])/g;
      const ending = /\।|\?|\||\./;

      let value_in_array = sentence.split(ending);
      setValueInArray(value_in_array);
    }
    catch (exception) {
      console.log(exception)
    }

  }, []);

  const handleClick = (index, item) => {
    setTimeout(() => {
      setHighlightedIndex(index);
      window.parent.postMessage({ index, item }, '*');
    }, 500);
    console.log(index);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * sentencesPerPage;
  const endIndex = startIndex + sentencesPerPage;
  const selectedSentences = value_in_array.slice(startIndex, endIndex);
  const pageCount = Math.ceil(value_in_array.length / sentencesPerPage);

  return (

    <div>
      {selectedSentences.map((item, index) => (
        <p key={startIndex + index} style={{ backgroundColor: highlightedIndex === startIndex + index ? 'yellow' : 'white' }} onClick={event => handleClick(startIndex + index, item)}>
          {startIndex + index + 1}.
          {item}
          {/* <div class="tooltip">{item}
            <span class="tooltiptext">{usrs[0].orignal_USR_json}</span>
          </div> */}
          {/* <a class="hover_text" data-tooltip={usrs[0].orignal_USR_json}>{item}</a> */}
        </p>
      ))}
      <div className='alignPagination'>
        <Pagination count={pageCount} size="large" page={page} onChange={handleChangePage} />
      </div>


    </div>
  );
};

export default Sentences;