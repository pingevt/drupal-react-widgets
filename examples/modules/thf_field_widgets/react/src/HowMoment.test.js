import React from 'react';
import ReactDOM from 'react-dom';
import HowMoment from './HowMoment';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HowMoment />, div);
  ReactDOM.unmountComponentAtNode(div);
});
