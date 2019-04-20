import Table from "../Table";
import wakemedDrg from "../../data/wakemed/drg";
// not named index.js, so must call the name of the file

/** WakeMedTable presents the wakemed DRG
 * data in a tabulator table.
 */
class WakeMedTable extends Table {
  tableData = wakemedDrg;
  columns = [
    { title: "Code", field: "drg_code" },
    { title: "Description", field: "drg_description" },
    { title: "Average Price", field: "avg_price" },
  ];
  tableHeader = "WakeMed DRG";
}
export default WakeMedTable;
