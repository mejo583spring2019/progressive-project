import Table from "../Table";
import wm_drg from "../../data/wakemed/drg";

class WMTable extends Table {
    tableData = wm_drg;
    columns = [
        {
            title: "Code",
            field: "drg_code"
        },
        {
            title: "Description",
            field: "drg_description"
        },
        {
            title: "Average Price",
            field: "avg_price"
        }

    ]
    tableHeader = "Wake Med DRG";
}

export default WMTable