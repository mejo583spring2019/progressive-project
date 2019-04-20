import Table from "../Table";
import uncDrg from "../../data/unc/drg";

/** make a table with unc data */
class UNCTable extends Table {
    tableData = uncDrg
    columns = [
      { title: "code", field: "drg_code" },
      { title: "description", field: "drg_description" },
      { title: "average price", field: "avg_price" },
    ]
    tableHeader = "UNC Medical Center DRG"
}

export default UNCTable;
