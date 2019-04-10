import React, { Component } from 'react';
import Tabulator from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator.min.css"; //import Tabulator stylesheet

class Table extends Component {
    el = React.createRef();
    tabulator = null; //variable to hold your table
    tableData = []; //data for table to display
    columns = []; //column definitions

    componentDidMount() {
        //instantiate Tabulator when element is mounted
        this.tabulator = new Tabulator(this.el, {
            data: this.tableData, //link data to table
            reactiveData: true, //enable data reactivity
            columns: this.columns, //define table columns
        });
    }

    render() {
        return <div ref={el => (this.el = el)} />
    }
}

export default Table;
