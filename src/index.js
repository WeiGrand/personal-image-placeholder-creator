/**
 * Created by heweiguang on 2019-01-19.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.scss';
import Header from './components/Header';
import Main from './components/Main';

class App extends Component {
  render () {

    return (
      <div className="nes-container">
        <Header />
        <Main />
      </div>
    )
  }
}

render(<App />, document.getElementById('root'));
