import React, { Component } from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";

import DukeTable from "./components/DukeTable";
import UNCTable from "./components/UNCTable";
import WakeTable from "./components/WakeTable";
import BubbleChart from "./components/BubbleChart";
import GroupChart from "./components/GroupChart";

import "./index.css";

/** Create an Index that returns to home
 * @return {any} JSX to render header.
 */
function Index() {
  return (
    <div className="home__text">
      <h2>Hello World</h2>
      <p>Colophon lives here</p>
    </div>
  );
}

/** App to render the whole project */
class App extends Component {
  /** Render JSX to call each component
   * @return {any} Router to build out project
   */
  render() {
    return (
      <Router>
        <div className="flex-column">
          <nav >
            <ul className="nav__links flex">
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
                <Link to="/data/duke/">Duke DRG</Link>
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
          <Route path="/data/duke" exact component={DukeTable} />
          <Route path="/data/unc" exact component={UNCTable} />
          <Route path="/data/wakemed" exact component={WakeTable} />
        </div>
      </Router>
    );
  }
}

export default App;
