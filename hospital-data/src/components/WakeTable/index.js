import Table from "../Table";
import wakeDrg from "../../data/wake/drg";

/** WakeTable presents the Wake Med drg
 * data in a tabulator table.
*/
class WakeTable extends Table {
  tableData = wakeDrg;
  columns = [
    { title: "Code", field: "drg_code" },
    { title: "Description", field: "drg_description" },
    { title: "Average Price", field: "avg_price" },
  ];
  tableHeader = "Wake Med DRG";
}

export default WakeTable;
