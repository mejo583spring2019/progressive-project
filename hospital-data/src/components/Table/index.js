import React, { Component } from "react";
import Tabulator from "tabulator-tables"; // import Tabulator library
// import Tabulator stylesheet
import "tabulator-tables/dist/css/tabulator.min.css";

/** Table presents the specified tabledata
 * and columns as a tabulator table.
 */
class Table extends Component {
  el = React.createRef();
  tabulator = null; // variable to hold your table
  tableData = []; // data for table to display
  columns = []; // column definitions
  tableHeader = "";

  /** componentDidMount instantiates
   * a Tabulator when element is mounted.
   */
  componentDidMount() {
    // instantiate Tabulator when element is mounted
    this.tabulator = new Tabulator(this.el, {
      height: "400px",
      data: this.tableData, // link data to table
      reactiveData: true, // enable data reactivity
      columns: this.columns, // define table columns
    });
  }

  /** Render this table with a header.
   * @return {any} JSX context
   */
  render() {
    return (
      <div>
        <h2>{this.tableHeader}</h2>
        <div ref={(el) => (this.el = el)} />;
      </div>
    );
  }
}

export default Table;
