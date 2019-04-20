import React, { Component } from "react";
import Tabulator from "tabulator-tables"; // import Tabulator library
import "tabulator-tables/dist/css/tabulator.min.css";
// import Tabulator stylesheet

/** create table
 * @return {any}
*/
class Table extends Component {
  el = React.createRef();

  tabulator = null; // variable to hold your table
  tableData = []; // data for table to display
  columns = []; // headers for table columns
  tableHeader = "";

  /** instantiate Tabulator when element is mounted
    * @param {object} this.el
   */
  componentDidMount() {
    this.tabulator = new Tabulator(this.el, {
      height: "500px",
      data: this.tableData, // link data to table
      reactiveData: true, // enable data reactivity
      columns: this.columns, // define table columns
    });
  }

  /** render header with table
   *  @return {any}
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
