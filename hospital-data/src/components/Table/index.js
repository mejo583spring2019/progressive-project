import React, { Component } from "react";
// import Tabulator library
import Tabulator from "tabulator-tables";
// import Tabulator stylesheet
import "tabulator-tables/dist/css/tabulator.min.css";

class Table extends Component {
  el = React.createRef();
  tabulator = null; // variable to hold your table
  tableData = []; // data for table to display
  columns = []; // column definitions
  tableHeafer = "";

  componentDidMount() {
    // instantiate Tabulator when element is mounted
    this.tabulator = new Tabulator(this.el, {
      height: "500px",
      data: this.tableData, // link data to table
      reactiveData: true, // enable data reactivity
      columns: this.columns, // define table columns
    });
  }

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
