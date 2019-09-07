import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import Renderer from './components/renderer';
import basicHistogram from './specs/basicHistogram.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <Renderer spec={basicHistogram} />;
  }
}

export default hot(App);
