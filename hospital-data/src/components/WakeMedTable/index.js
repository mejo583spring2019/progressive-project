import Table from "../Table";
import wakemedDRG from "../../data/wakemed/drg";

class WakeMedTable extends Table {
  tableData = wakemedDRG;
  columns = [
    { title: "Code", field: "drg_code" },
    { title: "Description", field: "drg_description" },
    { title: "Average Price", field: "avg_price" },
  ];
  tableHeader = "WakeMed Hospital";
}

export default WakeMedTable;
