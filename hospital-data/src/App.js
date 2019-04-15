import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from "react-router-dom";

import DukeTable from './components/DukeTable';
import UNCTable from './components/UNCTable';
import WakeMedTable from './components/WakeMedTable';
import BubbleChart from './components/BubbleChart'

function Index() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
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
              <Link to="/chart">Bubble Chart</Link>
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
        <Route path="/data/duke" component={DukeTable} />
        <Route path="/data/unc" component={UNCTable} />
        <Route path="/data/wakemed" component={WakeMedTable} />
      </div>
    </Router>
    );
  }
}

export default App;
