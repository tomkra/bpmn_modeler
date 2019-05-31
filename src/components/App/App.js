import React, { Component } from "react";
import Header from "../Header/Header";
import Footer from "../Footer";
import Modeler from "bpmn-js/lib/Modeler";
import Canvas from "./Canvas/InfiniteCanvas";
// import ReactBpmn from 'react-bpmn';

import "../../styles/main.css";

class App extends Component {
  render() {
    function onShown() {
      console.log("diagram shown");
    }

    function onLoading() {
      console.log("diagram loading");
    }

    function onError(err) {
      console.log("failed to show diagram");
    }

    return (
      <React.Fragment>
        <Header />
        <div id="main-wrapper">
          <div id="left-sidebar" />
          <div id="canvas">
            {/* <ReactBpmn
              url="/public/diagram.bpmn"
              onShown={onShown}
              onLoading={onLoading}
              onError={onError}
            /> */}
          </div>
          <div id="right-sidebar" />
        </div>
        <script src="https://unpkg.com/bpmn-js@0.27.0-1/dist/bpmn-viewer.development.js" />
        <Footer />
      </React.Fragment>
    );
  }
}
export default App;
