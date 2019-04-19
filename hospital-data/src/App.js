import React, { Component } from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";

import DukeTable from "./components/DukeTable";
import UNCTable from "./components/UNCTable";
import WakeMedTable from "./components/WakeMedTable";
import BubbleChart from "./components/BubbleChart";
import GroupChart from "./components/GroupChart";

function Index() {
  return (
    <div>
      <h2 className="main-header">Home</h2>
      <div className="intro">This project was composed from data retrieved from UNC, Duke, and Wakemed hospitals.
      It was constructed in ReactJS for MEJO 583 at UNC-Chapel Hill.</div>
    </div>
  );
}


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav>
            <div id="navbar">
              <div class="linkwrapper">
                <Link to="/">
                  <div id="link1" className="nav-item">
                    <span className="nav-item-text">Home</span>
                  </div>
                </Link>
              </div>
              <div class="linkwrapper">
                <Link to="/chart">
                  <div id="link2" className="nav-item">
                    <span className="nav-item-text">Bubble Chart</span>
                  </div>
                </Link>
              </div>
              <div class="linkwrapper">
                <Link to="/chart/group">
                  <div id="link3" className="nav-item">
                    <span className="nav-item-text">Group Chart</span>
                  </div>
                </Link>
              </div>
              <div class="linkwrapper">
                <Link to="/data/duke">
                  <div id="link4" className="nav-item">
                    <span className="nav-item-text">Duke DRG</span>
                  </div>
                </Link>
              </div>
              <div class="linkwrapper">
                <Link to="/data/unc">
                  <div id="link5" className="nav-item">
                    <span className="nav-item-text">UNC DRG</span>
                  </div>
                </Link>
              </div>
              <div class="linkwrapper">
                <Link to="/data/wakemed">
                  <div id="link6" className="nav-item">
                    <span className="nav-item-text">WakeMed DRG</span>
                  </div>
                </Link>
              </div>
            </div>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/chart" exact component={BubbleChart} />
          <Route path="/chart/group" exact component={GroupChart} />
          <Route path="/data/unc" exact component={UNCTable} />
          <Route path="/data/duke" exact component={DukeTable} />
          <Route path="/data/wakemed" exact component={WakeMedTable} />
        </div>
      </Router>
    );
  }
}

export default App;
