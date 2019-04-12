import Table from "../Table";
import uncDRG from "../../data/unc/drg";

class UNCTable extends Table {
  tableData = uncDRG;
  columns = [
    { title: "Code", field: "drg_code" },
    { title: "Description", field: "drg_description" },
    { title: "Average Price", field: "avg_price" },
  ];
  tableHeader = "UNC Medical Center";
}

export default UNCTable;
