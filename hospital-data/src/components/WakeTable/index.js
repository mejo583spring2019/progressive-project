import Table from "../table";
import wakeDrg from "../../data/wake/drg";
/**
 * creates a table for wakemed data
 */
class WakeTable extends Table {
    tableData = wakeDrg;
    columns = [
      {title: "Code", field: "drg_code"},
      {title: "Description", field: "drg_description"},
      {title: "Average Price", field: "avg_price"},
    ]
    tableHeader = "WakeMed DRG";
}

export default WakeTable;
