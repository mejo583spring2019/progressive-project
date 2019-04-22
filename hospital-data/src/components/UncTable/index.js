import Table from "../table";
import uncDrg from "../../data/unc/drg";
/**
 * creates a table for unc data
 */
class UncTable extends Table {
    tableData = uncDrg;
    columns = [
      {title: "Code", field: "drg_code"},
      {title: "Description", field: "drg_description"},
      {title: "Average Price", field: "avg_price"},
    ]
    tableHeader = "UNC Medical Center DRG";
}

export default UncTable;
