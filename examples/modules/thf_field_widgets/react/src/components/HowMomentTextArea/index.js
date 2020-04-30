import React, { useState, useEffect, useContext, useRef } from 'react';

import { HowMomentDispatch } from '../../HowMoment';

import './text-area.scss';

const HowMomentTextArea = ({ statementText }) => {
  const [inputText] = useState(statementText);
  const textArea = useRef(null);
  const dispatch = useContext(HowMomentDispatch);

  useEffect(() => {
    const textInput = textArea.current;

    if (textInput !== null) {
      textInput.addEventListener('paste', handlePaste);
    }

    return () => {
      textInput.removeEventListener('paste', handlePaste);
    };
  }, []);

  function handlePaste(e) {
    e.preventDefault();

    // Convert pasted text to plain text
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  }

  function handleInputChange(e) {
    // Remove injected non-breaking spaces from HTML output
    const value = e.currentTarget.innerHTML.replace(/&nbsp;/g, ' ');

    dispatch({ type: 'setStatementText', text: value });
  }

  return (
    <div className="text-area u-mar-bottom-xl">
      <label
        className="text-area__label widget-label widget-label--bold u-pad-bottom-xxxs"
        htmlFor="text-area"
      >
        Statement
      </label>
      <div className="text-area__formatting">
        <button
          className="text-area__format"
          onClick={e => {
            e.preventDefault();
            document.execCommand('bold', false, null);
          }}
        >
          <b>b</b>
        </button>
        <button
          className="text-area__format"
          onClick={e => {
            e.preventDefault();
            document.execCommand('italic', false, null);
          }}
        >
          <i>i</i>
        </button>
        <button
          className="text-area__format"
          onClick={e => {
            e.preventDefault();
            document.execCommand('underline', false, null);
          }}
        >
          <u>u</u>
        </button>
      </div>
      <div
        ref={textArea}
        className="text-area__input"
        onInput={handleInputChange}
        dangerouslySetInnerHTML={{ __html: inputText }}
        contentEditable
      />
    </div>
  );
};

export default HowMomentTextArea;
