import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import imgURL from './logo.svg';

ReactDOM.render(
	<div className="App">
		    <img className="App-img" src={ imgURL } />
		    <p className="App-p">React-APP</p>
	</div>
, document.getElementById('root'));