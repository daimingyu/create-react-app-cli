import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.js';

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!!!!');
}

ReactDOM.render(<App />, document.getElementById('root'));