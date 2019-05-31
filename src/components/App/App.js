import React, { Component } from "react";
import Header from "../Header/Header";
import Footer from "../Footer";
import Modeler from "./Modeler";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import "../../styles/main.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />

        <div id="main-wrapper">
          <div id="canvas">
            <Modeler />
          </div>
        </div>

        <Footer />
      </React.Fragment>
    );
  }
}
export default App;
