import React, { Component } from "react";
import Tabulator from "tabulator-tables"; // import Tabulator library
import "tabulator-tables/dist/css/tabulator.min.css";
// import Tabulator stylesheet
/** this is a JSDOC comment.
   * @return {any} a div.
   */
class Table extends Component {
  el = React.createRef();
  tabulator = null; // variable to hold your table
  tableData = []; // data for table to display
  columns = []; // column  definitions
  tableHeader = "";
  /** this is a JSDOC comment.*/
  componentDidMount() {
    // instantiate Tabulator when element is mounted
    this.tabulator = new Tabulator(this.el, {
      height: "500px",
      data: this.tableData, // link data to table
      reactiveData: true, // enable data reactivity
      columns: this.columns, // define table columns
    });
  }
  /** this is a JSDOC comment.
     * @return {any} a div.
     */
  render() {
    return (
      <div>
        <h2>{this.tableHeader}</h2>
        <div ref={(el) => (this.el = el)} /> </div >
    );
  }
}


export default Table;
