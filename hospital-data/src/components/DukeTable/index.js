import Table from "../Table";
import dukeDRG from "../../data/duke/drg";

/**
 * DukeTable presents the wakemed DRG
 * data in a tabulator table.
 */
class DukeTable extends Table {
    tableData = dukeDRG;
    columns = [
      { title: "Code", field: "drg_code" },
      { title: "Description", field: "drg_description" },
      { title: "Average Price", field: "avg_price" },
    ]
    tableHeader = "Duke University Hospitals DRG"
}

export default DukeTable;
