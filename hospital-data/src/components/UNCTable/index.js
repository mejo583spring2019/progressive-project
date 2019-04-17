import Table from "../Table";
import unc_drg from '../../data/unc/drg';

class UNCTable extends Table {
    tableData = unc_drg
    columns = [
        { title: "code", field: "drg_code" },
        { title: "description", field: "drg_description" },
        { title: "average price", field: "avg_price" },
    ]
    tableHeader = "UNC Medical Center DRG"
}

export default UNCTable;