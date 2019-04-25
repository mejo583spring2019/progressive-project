import React, { Component } from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";

import DukeTable from "./components/DukeTable";
import UNCTable from "./components/UNCTable";
import WakeTable from "./components/WakeTable";
import BubbleChart from "./components/BubbleChart";
import GroupChart from "./components/GroupChart";
import Colophon from "./components/Colophon";

import "./index.css";

/** Create an Index that returns the home page
 * where the COLOPHON will live
 * @return {any} JSX to render header.
 */
function Index() {
  return (
    <div className="home__text">
      <h2>Hello!</h2>
      <p>Welcome to the progressive project built by the members of the
        UNC School of Media and Journalism's 583 class.
        This data represents the publicly-available hospital data from <a href="https://www.dukehealth.org/hospitals/duke-university-hospital/home" target="_blank" rel="noopener noreferrer">
          Duke Med</a>, <a href="https://www.uncmedicalcenter.org/uncmc/hospitals-locations/profile/unc-hospitals/" target="_blank" rel="noopener noreferrer">
          UNC Hospitals</a>, and <a href="https://www.wakemed.org/" target="_blank" rel="noopener noreferrer">Wake Med</a>.
      </p>
      <p>
        Click on the links above to see the data
        presented in table form or bubble charts.
      </p>
      <img src="https://cdn.pixabay.com/photo/2017/08/07/20/05/doctors-2607295_960_720.jpg" alt="A group of doctors stand in a hospital hallway" />
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
              <li>
                <Link to="/colophon">Colophon</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/chart" exact component={BubbleChart} />
          <Route path="/chart/group" exact component={GroupChart} />
          <Route path="/data/duke" exact component={DukeTable} />
          <Route path="/data/unc" exact component={UNCTable} />
          <Route path="/data/wakemed" exact component={WakeTable} />
          <Route path="/colophon" exact component={Colophon} />
        </div>
      </Router>
    );
  }
}

export default App;
