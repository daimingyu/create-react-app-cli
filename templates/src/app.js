import React, { Component } from 'react';
import './app.css'
import imgURL from './photo.png';

class App extends Component {
  render() {
    return (
      <div className="App">
        <p className="App-p">React-App</p>
        <img src={ imgURL } />
      </div>
    );
  }
}

export default App;