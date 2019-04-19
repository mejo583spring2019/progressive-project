import Table from "../Table";
import wakemedDRG from "../../data/wakemed/drg";

/** WakeMedTable presents the WakeMed DRG
 * data in a tabulator table.
 */
class WakeMedTable extends Table {
  tableData = wakemedDRG;
  columns = [
    { title: "Code", field: "drg_code" },
    { title: "Description", field: "drg_description" },
    { title: "Average Price", field: "avg_price" },
  ];
  tableHeader = "WakeMed Hospital DRG";
}

export default WakeMedTable;
