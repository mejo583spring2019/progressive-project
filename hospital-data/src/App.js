import React, { Component } from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";

import DukeTable from "./components/DukeTable";
import UNCTable from "./components/UNCTable";
import WakeTable from "./components/WakeTable";


function Index() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
/** Hello there */
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
          <Route path="/data/duke" component={DukeTable} />
          <Route path="/data/unc" component={UNCTable} />
          <Route path="/data/wakemed" component={WakeTable} />
        </div>
      </Router>
    );
  }
}

export default App;
