import React, { Component } from "react";
import Tabulator from "tabulator-tables"; // import Tabulator library
import "tabulator-tables/dist/css/tabulator.min.css";
// import Tabulator stylesheet

/** Table presents the specified tableData
 * and columns as a tabulator table.
 */
class Table extends Component {
  el = React.createRef();
  tabulator = null; // variable to hold your table
  tableData = []; // data for table to display
  columns = []; // column definitions
  tableHeader = "";

  /** componentDidMount instantiates
   * a Tabulator when element is mounted
   */
  componentDidMount() {
    this.tabulator = new Tabulator(this.el, {
      height: "500px",
      data: this.tableData, // link data to table
      reactiveData: true, // enable data reactivity
      columns: this.columns, // define table columns
    });
  }

  /** Render this table with a header.
   * @return {any} JSX content.
  */
  render() {
    return (
      <div>
        <h2>{this.tableHeader}</h2>
        <div ref={(el) => (this.el = el)} />
      </div>
    );
  }
}

export default Table;
