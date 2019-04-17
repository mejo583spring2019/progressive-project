import Table from "../Table";
import wakemedDrg from "../../data/wakemed/drg";

class WakeMedTable extends Table {
  tableData = wakemedDrg;
  columns = [
    {title: "Code", field: "drg_code"},
    {title: "Description", field: "drg_description"},
    {title: "Average Price", field: "avg_price"},
  ];
  tableHeader = "WakeMed DRG"
}

export default WakeMedTable;
