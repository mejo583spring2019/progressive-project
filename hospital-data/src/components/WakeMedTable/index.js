import Table from "../Table";
import wakemedDrg from "../../data/wakemed/drg";
// not named index.js, so must call the name of the file

/** Sets up DukeTable data */
class WakeMedTable extends Table {
  tableData = wakemedDrg;
  columns = [
    { title: "Code", field: "drg_code" },
    { title: "Description", field: "drg_description" },
    { title: "Average Price", field: "avg_price" },
  ];
}
export default WakeMedTable;
