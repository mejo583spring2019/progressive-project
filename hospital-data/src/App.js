import React, { Component } from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import UNCTable from "./components/UNCTable";
import WakeMedTable from "./components/WakeMedTable";
import DukeTable from "./components/DukeTable";


/** this is a JSDOC comment */
/** this is a JSDOC comment.
 * @return {string}.
*/
function Index() {
  return <h2>Home</h2>;
}
/** this is a JSDOC comment.
 * @return {string}.
*/
// function About() {
//   return <h2>About</h2>;
// }
// /** this is a JSDOC comment.
//  * @return {string}.
// */
// function Users() {
//   return <h2>Users</h2>;
// }
/** this is a JSDOC comment */
class App extends Component {
  /** this is a JSDOC comment.
   * @return {any} a div.
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
                <Link to="/data/wakemed">WakeMed DRG</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/data/duke" component={DukeTable} />
          <Route path="/data/unc" component={UNCTable} />
          <Route path="/data/wakemed" component={WakeMedTable} />

        </div>
      </Router>
    );
  }
}

export default App;
