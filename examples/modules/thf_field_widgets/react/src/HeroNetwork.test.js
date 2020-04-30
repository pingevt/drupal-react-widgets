import React from 'react';
import ReactDOM from 'react-dom';
import HeroNetwork from './HeroNetwork';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HeroNetwork />, div);
  ReactDOM.unmountComponentAtNode(div);
});
