import React, { Component } from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
// import DukeTable from "./components/DukeTable";

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
function About() {
  return <h2>About</h2>;
}
/** this is a JSDOC comment.
 * @return {string}.
*/
function Users() {
  return <h2>Users</h2>;
}
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
                <Link to="/about/">About</Link>
              </li>
              <li>
                <Link to="/users/">Users</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/about/" component={About} />
          <Route path="/users/" component={Users} />
        </div>
      </Router>
    );
  }
}

export default App;
