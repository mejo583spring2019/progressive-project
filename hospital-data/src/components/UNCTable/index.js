import Table from "../Table";
import uncDrg from "../../data/unc/drg";

/** UNCTable is a react component built off the
 * component Table
 * It takes uncDrg data with columns Code, Description and average price
 * The table header is University of North Carolina Hospital DRG
 */
class UNCTable extends Table {
  tableData = uncDrg;
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
  tableHeader = "University of North Carolina Hospital DRG";
}

export default UNCTable;
