import Table from "../Table";
import dukeDrg from "../../data/duke/drg";

class DukeTable extends Table {
  tableData = dukeDrg;
  columns = [
    { title: "Code", field: "drg_code" },
    { title: "Description", field: "drg_description" },
    { title: "Average Price", field: "avg_price" },
  ];
  tableHeader = "Duke University Hospital DRG";
}

export default DukeTable;
