import Table from "../Table";
import dukeDrg from "../../data/duke/drg";

/** DukeTable is a react component built off the
 * component Table
 * It takes dukeDrg data with columns Code, Description and average price
 * The table header is Duke University Hospital DRG
 */
class DukeTable extends Table {
  tableData = dukeDrg;
  columns = [
    {
      title: "Code",
      field: "drg_code",
    },
    {
      title: "Description",
      field: "drg_description",
    },
    {
      title: "Average Price",
      field: "avg_price",
    },

  ]
  tableHeader = "Duke University Hospital DRG";
}

export default DukeTable;
