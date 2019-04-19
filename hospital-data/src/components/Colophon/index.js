import React, { Component } from "react";


/**
   * Colophon creates the HTML
   * for the colophon page
   */
class Colophon extends Component {
  /**
   * Renders the Colophon
   * @return {any} JSX to build the colophon information
   */
  render() {
    return (
      <div className="colophon__body flex-column">
        <h2>Website Colophon</h2>
        <p>Hello, I'm the website colophon!</p>
      </div>
    );
  }
}

export default Colophon;
