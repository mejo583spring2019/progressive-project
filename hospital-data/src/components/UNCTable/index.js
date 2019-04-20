import Table from "../Table";
import uncDrg from "../../data/unc/drg";
// not named index.js, so must call the name of the file

/** UNCTable presents the UNC DRG
 * data in a tabulator table.
 */
class UNCTable extends Table {
  tableData = uncDrg;
  columns = [
    { title: "Code", field: "drg_code" },
    { title: "Description", field: "drg_description" },
    { title: "Average Price", field: "avg_price" },
  ];
  tableHeader = "UNC Hospital DRG";
}
export default UNCTable;
