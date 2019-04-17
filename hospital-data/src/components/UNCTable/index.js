import Table from "../Table";
import unc_drg from "../../data/unc/drg";

class UNCTable extends Table {
    tableData = unc_drg;
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
    tableHeader = "University of North Carolina Hospital DRG";

}

export default UNCTable