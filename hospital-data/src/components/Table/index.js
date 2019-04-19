import React, { Component } from "react";
import Tabulator from "tabulator-tables"; // import Tabulator library
import "tabulator-tables/dist/css/tabulator.min.css"; // import Tabulator style

import "./styles.css";

/**
 * Table uses tabulator to create the basic template for our data tables
 */
class Table extends Component {
  el = React.createRef();
  tabulator = null; // variable to hold your table
  tableData = []; // data for table to display
  columns = []; // column definitions
  tableHeader = "";

  /**
   * componentDidMount instantiates Tabulator when element is mounted
   */
  componentDidMount() {
    this.tabulator = new Tabulator(this.el, {
      height: "500px",
      data: this.tableData, // link data to table
      reactiveData: true, // enable data reactivity
      columns: this.columns, // define table columns
    });
  }
  /**
   * render renders the table and its header
   * @return {object} div containing table and header
   */
  render() {
    return (
      <div>
        <h2 className="main-header">{this.tableHeader}</h2>
        < div ref={(el) => (this.el = el)} />;
      </div>
    );
  }
}


export default Table;
