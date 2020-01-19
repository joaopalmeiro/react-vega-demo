import React, { Component } from "react";
import Renderer from "./Renderer";
import Histogram from "../specs/histogram.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <Renderer spec={Histogram} />;
  }
}

export default App;
