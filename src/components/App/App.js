import React, { Component } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer'
;
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <div id="main-wrapper">
          <div id="left-sidebar"></div>
          <div id="canvas"></div>
          <div id="right-sidebar"></div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
