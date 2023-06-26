import React, { useState } from 'react';
import './SinglePageApi.css';
import { NavLink } from 'react-router-dom';
import USRgenerate from '../USRgenerationFolder/USRgenerate';
import viewTable from "../USRgenerationFolder/USR";

const App = () => {
  const [progress, setProgress] = useState(0);
  const [accordions, setAccordions] = useState({
    accordion1: false,
    accordion2: false,
  });
  const [accordion1Option, setAccordion1Option] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [originalSentences, setOriginalSentences] = useState([]);
  const [modifiedSentences, setModifiedSentences] = useState([]);

  const handleButtonClick = (buttonIndex) => {
    // Check if the button is already clicked
    const accordionKey = `accordion${buttonIndex}`;
    if (accordions[accordionKey]) {
      return; // Exit early if the button is already clicked
    }

    // Update the progress based on the current accordion index
    const newProgress = (buttonIndex / 2) * 100;
    setProgress(newProgress);

    // Open the clicked accordion and leave the other accordion state unchanged
    setAccordions((prevAccordions) => {
      if (buttonIndex === 2 && !prevAccordions.accordion1) {
        return prevAccordions; // Exit early if the first accordion is not opened
      }

      return {
        ...prevAccordions,
        [accordionKey]: true,
      };
    });
  };

  const handleReset = () => {
    setProgress(0);
    setAccordions({
      accordion1: false,
      accordion2: false,
    });
    setAccordion1Option('');
    setGeneratedContent('');
    setOriginalSentences([]);
    setModifiedSentences([]);
  };

  const handleAccordion1OptionChange = (event) => {
    setAccordion1Option(event.target.value);
    setGeneratedContent('');
  };

  const handleUSRGenerate = (content) => {
    setGeneratedContent(content);
    setOriginalSentences([]); // Clear previous data
    setModifiedSentences([]); // Clear previous data

    // Perform logic to generate original and modified sentences based on the generated content
    // For demonstration purposes, let's assume the original and modified sentences are hardcoded
    const original = ['Original Sentence 1', 'Original Sentence 2'];
    const modified = ['Modified Sentence 1', 'Modified Sentence 2'];

    setOriginalSentences(original);
    setModifiedSentences(modified);

    handleButtonClick(2); // Automatically open the second accordion after generating the content
  };

  return (
    <div>
      <div className="button-container">
        <button onClick={() => handleButtonClick(1)} className={`button ${accordions.accordion1 ? 'active' : ''}`}>
          Text input
        </button>
        
        
        {accordions.accordion1 && ( // Render the "Generate USR" button only if accordion1 is opened
          <button onClick={() => handleButtonClick(2)} className={`button ${accordions.accordion2 ? 'active' : ''}`} disabled={!generatedContent}>
            Generate USR
          </button>
        )}
        {accordions.accordion2 && ( // Render the "Edit the USR" button only if accordion2 is opened
          <button className="button">
            Edit the USR
          </button>
        )}
        <button onClick={() => handleButtonClick(3)} className={`button ${accordions.accordion3 ? 'active' : ''}`} disabled={!accordions.accordion2}>
          Results
        </button>
        <button onClick={handleReset} className="button">
          Reset
        </button>
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="accordions">
        <h2>Language Communicator</h2>
        <div className="accordion">
          <button onClick={() => handleButtonClick(1)} className='accordion-button'>Enter Text</button>
          {accordions.accordion1 && (
            <div>
              <USRgenerate onUSRGenerate={handleUSRGenerate} />
            </div>
          )}
        </div>
        <div className="accordion">
          <button onClick={() => handleButtonClick(2)}className='accordion-button'>Generate Hindi USR</button>
          {accordions.accordion2 && (
            <div>
              <div className="container">
                <div className="box">
                  <h2 className="box-heading">Original Hindi Sentences</h2>
                  <ul>
                    {originalSentences.map((sentence, index) => (
                      <li key={index}>{sentence}</li>
                    ))}
                  </ul>
                </div>
                <div className="box">
                  <h2 className="box-heading">Generated Hindi Sentences</h2>
                  <ul>
                    {modifiedSentences.map((sentence, index) => (
                      <li key={index}>{sentence}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button onClick={handleReset} className="button" id="reset">
                Reset (takes you to the initial phase of the process)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
