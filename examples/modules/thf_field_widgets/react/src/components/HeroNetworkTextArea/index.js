import React, { useState, useEffect, useContext, useRef } from 'react';

import { HeroNetworkDispatch } from '../../HeroNetwork';

import '../HowMomentTextArea/text-area.scss';

const TextArea = ({ statementText }) => {
  const [inputText, setInputText] = useState(null);
  const textArea = useRef(null);
  const dispatch = useContext(HeroNetworkDispatch);

  useEffect(() => {
    if (inputText === null || inputText === '') {
      setInputText(statementText);
    }

  }, [inputText, statementText]);

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
    const value = e.currentTarget.innerHTML.replace(/&nbsp;/g, ' ').replace(/<div>/gi, '<br>').replace(/<\/div>/gi, '');

    dispatch({ type: 'setStatementText', text: value });
  }

  return (
    <div className="text-area u-mar-bottom-xl">
      <label
        className="text-area__label widget-label widget-label--bold u-pad-bottom-xxxs"
        htmlFor="text-area"
      >
        Hero Statement
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
        <button
          className="text-area__format"
          onClick={e => {
            e.preventDefault();
            document.execCommand('removeFormat', false, null);
          }}
        >
          <i>T<sub>x</sub></i>
        </button>
      </div>
      <div
        ref={textArea}
        className="text-area__input"
        onInput={handleInputChange}
        dangerouslySetInnerHTML={{ __html: inputText }}
        contentEditable
      />
      <p><em>Please use</em> Shift + Enter <em>to add line breaks. Just using</em> Enter <em>will create an extra line break. In case of error, this will be converted to a single line break when saved.</em></p>
    </div>
  );
};

export default TextArea;
