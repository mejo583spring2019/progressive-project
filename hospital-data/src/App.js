import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import DukeTable from "./components/DukeTable";
import UNCTable from "./components/UNCTable";
import WakeMedTable from "./components/WakeMedTable";

function Index() {
  return <h2>Home</h2>;
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
                <Link to="/data-duke">Duke DRG</Link>
              </li>
              <li>
                <Link to="/data-unc">UNC DRG</Link>
              </li>
              <li>
                <Link to="/data-wm">WakeMed DRG</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/data-duke/" component={DukeTable} />
          <Route path="/data-UNC/" component={UNCTable} />
          <Route path="/data-wm/" component={WakeMedTable} />
        </div>
      </Router>

    );
  }
}

export default App;
