import Table from "../Table";
import wakemedDrg from "../../data/wakemed/drg";

/** make a table with wakemed data */
class WakeMedTable extends Table {
  tableData = wakemedDrg
  columns = [
    { title: "code", field: "drg_code" },
    { title: "description", field: "drg_description" },
    { title: "average price", field: "avg_price" },
  ]
  tableHeader = "Wake Med DRG"
}

export default WakeMedTable;
