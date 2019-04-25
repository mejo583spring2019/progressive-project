import React, { Component } from "react";

import "./styles.css";

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
        <p>This page outlines technical details about this website.</p>
        <p>
          This website was created using <a href="https://reactjs.org/">
            React
          </a> and <a href="https://nodejs.org/en/">
            Node</a>.
        </p>
        <p>
          It is hosted on <a href="https://pages.github.com/">GitHub pages</a> using <a href="https://facebook.github.io/create-react-app/docs/deployment">this tutorial</a> on how to set it up.
        </p>
        <h2>Plugins</h2>
        <p>This website takes advantages of many package libraries to
          get things done, such as <a href="https://reacttraining.com/react-router">React Router</a> and <a href="https://www.npmjs.com/package/tabulator">Tabulator</a>.
        </p>
        <h2>Data</h2>
        <p>
          The data used for this project is publicly-sourced data from
          three major hospitals in the Triangle. Data looks at the
          average price of procedures at each hospital.
          Data was cleaned from CSV files to JSON data and then
          parsed over to be presented graphically.
        </p>
        <img src="https://svgsilh.com/svg/30591.svg" alt="the sign of medical profession, the caduceus" />
      </div>
    );
  }
}

export default Colophon;
