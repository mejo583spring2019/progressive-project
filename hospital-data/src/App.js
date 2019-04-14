import React, { Component } from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import DukeTable from "./components/DukeTable";
import UncTable from "./components/UncTable";
import WakeTable from "./components/WakeTable";

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
          <Route path="/data/duke" component={DukeTable} />
          <Route path="/data/unc/" component={UncTable} />
          <Route path="/data/wake/" component={WakeTable} />
        </div>
      </Router>
    );
  }
}

export default App;
