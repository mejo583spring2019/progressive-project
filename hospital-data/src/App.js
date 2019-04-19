import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from "react-router-dom";

import DukeTable from "./components/DukeTable";
import UNCTable from "./components/UNCTable";
import WakeMedTable from "./components/WakeMedTable";
import BubbleChart from "./components/BubbleChart";
import GroupChart from "./components/GroupChart";

function Index() {
  return (
    <div>
      <h2>Home</h2>;
    </div>
  );
}

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/chart/group">Group Chart</Link>
              </li>
              <li>
                <Link to="/chart">BubbleChart</Link>
              </li>
              <li>
                <Link to="/data/duke">Duke DRG</Link>
              </li>
              <li>
                <Link to="/data/unc">UNC DRG</Link>
              </li>
              <li>
                <Link to="/data/wakemed">WakeMed DRG</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/chart" exact component={BubbleChart} />
          <Route path="/chart/group" exact component={GroupChart} />
          <Route path="/data/duke" exact component={DukeTable} />
          <Route path="/data/unc" exact component={UNCTable} />
          <Route path="/data/wakemed" exact component={WakeMedTable} />

        </div>
      </Router>
    );
  }
}

export default App;
