import React, { Component } from 'react';
import Tabulator from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator.min.css"; //import Tabulator stylesheet


class Table extends Component {
    el = React.createRef();
    tabulator = null; //variable to hold your table
    //data for table to display
    tableData = [];
    tableHeader = "";

    //define table columns
    columns = []

    componentDidMount() {
        //instantiate Tabulator when element is mounted
        this.tabulator = new Tabulator(this.el, {
            data: this.tableData, //link data to table
            height: "500px",
            reactiveData: true, //enable data reactivity
            columns: this.columns
        });
    }
    render() {
        return (
            <div>
                <h2>{this.tableHeader}</h2>
                <div ref={el => (this.el = el)} />
            </div>
        );
    }
}



export default Table;
