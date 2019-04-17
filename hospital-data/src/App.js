import React, { Component } from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import DukeTable from "./components/DukeTable";
import UncTable from "./components/UncTable";
import WakeTable from "./components/WakeTable";
import BubbleChart from "./components/BubbleChart";
import GroupChart from "./components/GroupChart";

/**
* @return{string}
*/
function Index() {
  return <h2>Home</h2>;
}


/**
* create table
*/
class App extends Component {
/**
* create table
* @return {string}
*/
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
                <Link to="/chart">Bubble Chart</Link>
              </li>
              <li>
                <Link to="/chart/group">Group Chart</Link>
              </li>
              <li>
                <Link to="/data/duke">Duke DRG</Link>
              </li>
              <li>
                <Link to="/data/unc">UNC DRG</Link>
              </li>
              <li>
                <Link to="/data/wake">Wake DRG</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/chart" exact component={BubbleChart} />
          <Route path="/chart/group" exact component={GroupChart} />
          <Route path="/data/duke" exact component={DukeTable} />
          <Route path="/data/unc/"exact component={UncTable} />
          <Route path="/data/wake/" exact component={WakeTable} />
        </div>
      </Router>
    );
  }
}

export default App;
