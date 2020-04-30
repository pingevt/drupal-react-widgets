import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const wrappers = document.querySelectorAll('.react-number-input');

wrappers.forEach(wrapper => {
  var attrs = {};

  for (let name of wrapper.getAttributeNames()) {
    // console.log(name, wrapper.getAttribute(name) );
    attrs[ name ] = wrapper.getAttribute(name);
  }

  // console.log(attrs);
  ReactDOM.render(<App wrapperAttrs={attrs} />, wrapper);

})
