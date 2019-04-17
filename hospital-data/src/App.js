import React, { Component } from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import DukeTable from "./components/DukeTable";
import UNCTable from "./components/UNCTable";
import WakeMedTable from "./components/WakeMedTable";
import BubbleChart from "./components/BubbleChart";
import GroupChart from "./components/GroupChart";

/**
 * Returns the index page 'Home' wrapped in header 2
 * @return {any}.
 */
function Index() {
  return <h2>Home</h2>;
}

/**
 * App component builds main app
 * @return {any} html with false links to different pages
 * and includes all other components built for this page
 */
class App extends Component {
  /**
 * Render  renders the index page with links
 * @return {any}.
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
                <Link to="/data-duke">Duke DRG</Link>
              </li>
              <li>
                <Link to="/data-unc">UNC DRG</Link>
              </li>
              <li>
                <Link to="/data-wm">WakeMed DRG</Link>
              </li>
              <li>
                <Link to="/chart">Bubble Chart</Link>
              </li>
              <li>
                <Link to="/chart/group">Group Chart</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/chart" exact component={BubbleChart} />
          <Route path="/chart/group" exact component={GroupChart} />
          <Route path="/data-duke/" exact component={DukeTable} />
          <Route path="/data-UNC/" exact component={UNCTable} />
          <Route path="/data-wm/" exact component={WakeMedTable} />
        </div>
      </Router>

    );
  }
}

export default App;
