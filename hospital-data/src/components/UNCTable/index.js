import Table from "../Table";
import uncDRG from "../../data/unc/drg";

/**
 * UNCTable presents the wakemed DRG
 * data in a tabulator table.
 */
class UNCTable extends Table {
  tableData = uncDRG;
  columns = [
    { title: "Code", field: "drg_code" },
    { title: "Description", field: "drg_description" },
    { title: "Average Price", field: "avg_price" },
  ];

  tableHeader = "UNC Hospitals DRG"
}

export default UNCTable;
