import Table from "../Table";
import dukeDrg from "../../data/duke/drg";
/** make a table with duke data */
class DukeTable extends Table {
  tableData = dukeDrg
  columns = [
    { title: "code", field: "drg_code" },
    { title: "description", field: "drg_description" },
    { title: "average price", field: "avg_price" },
  ]
  tableHeader = "Duke University DRG"
}

export default DukeTable;
