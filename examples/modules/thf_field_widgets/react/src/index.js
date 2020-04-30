import React from 'react';
import ReactDOM from 'react-dom';
import HowMoment from './HowMoment';
import HeroNetwork from './HeroNetwork';

const howWrappers = document.querySelectorAll('.react-input.how-moment-input');
const heroWrappers = document.querySelectorAll(
  '.react-input.hero-network-input'
);

if (howWrappers.length > 0) {
  howWrappers.forEach(wrapper => {
    var attrs = {};

    for (let name of wrapper.getAttributeNames()) {
      attrs[name] = wrapper.getAttribute(name);
    }

    ReactDOM.render(<HowMoment wrapperAttrs={attrs} />, wrapper);
  });
} else if (heroWrappers.length > 0) {
  heroWrappers.forEach(wrapper => {
    var attrs = {};

    for (let name of wrapper.getAttributeNames()) {
      attrs[name] = wrapper.getAttribute(name);
    }

    ReactDOM.render(<HeroNetwork wrapperAttrs={attrs} />, wrapper);
  });
} else {
  ReactDOM.render(
    <HowMoment wrapperAttrs={'test'} />,
    document.getElementById('root')
  );
}
