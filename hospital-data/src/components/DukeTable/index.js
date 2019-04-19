import Table from "../Table"
import dukeDRG from "../../data/duke/drg"

/** DukeTable presents the Duke DRG
 * data in a tabulator table **/
class DukeTable extends Table {
  tableData = dukeDRG;
  columns = [
    { titile: "code", field: "drg_code" },
    { title: "Description", field: "drg_description" },
    { title: "Average Price", field: "avg_price" }
  ];
  tableHeader = "Duke University Hospital DRG";
}

export default DukeTable;