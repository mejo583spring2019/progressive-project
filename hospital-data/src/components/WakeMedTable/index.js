import Table from "../Table";
import wmDrg from "../../data/wakemed/drg";

/** WMTable is a react component built off the
 * component Table
 * It takes wakemedDrg data with columns Code, Description and average price
 * The table header is Wake Med DRG
 */
class WMTable extends Table {
  tableData = wmDrg;
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
  tableHeader = "Wake Med DRG";
}

export default WMTable;
