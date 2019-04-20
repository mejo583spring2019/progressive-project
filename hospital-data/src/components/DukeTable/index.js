import Table from "../Table";
import dukeDrg from "../../data/duke/drg";
// not named index.js, so must call the name of the file

/** DukeTable presents the Duke DRG
 * data in a tabulator table.
 */
class DukeTable extends Table {
  tableData = dukeDrg;
  columns = [
    { title: "Code", field: "drg_code" },
    { title: "Description", field: "drg_description" },
    { title: "Average Price", field: "avg_price" },
  ];
  tableHeader = "Duke University Hospital DRG";
}
export default DukeTable;
