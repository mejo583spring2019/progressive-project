import Table from "../Table";
import uncDrg from "../../data/unc/drg";

/** This is a table */
class UNCTable extends Table {
  tableData = uncDrg;
  columns = [
    { title: "Code", field: "drg_code" },
    { title: "Description", field: "drg_description" },
    { title: "Average Price", field: "avg_price" },
  ];
}

export default UNCTable;
