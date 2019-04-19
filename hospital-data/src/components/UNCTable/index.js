import Table from "../Table"
import uncDRG from "../../data/unc/drg"

/** UNCTable presents the UNC DRG
 * data in a tabulator table **/
class UNCTable extends Table {
  tableData = uncDRG;
  columns = [
    { titile: "code", field: "drg_code" },
    { title: "Description", field: "drg_description" },
    { title: "Average Price", field: "avg_price" }
  ];
  tableHeader = "UNC Medical Center DRG";

}

export default UNCTable;