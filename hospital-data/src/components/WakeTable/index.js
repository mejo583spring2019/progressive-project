import Table from "../Table";
import wakeDrg from "../../data/wake/drg";

class WakeTable extends Table {
  tableData = wakeDrg;
  columns = [
    { title: "Code", field: "drg_code" },
    { title: "Description", field: "drg_description" },
    { title: "Average Price", field: "avg_price" },
  ];
}

export default WakeTable;
