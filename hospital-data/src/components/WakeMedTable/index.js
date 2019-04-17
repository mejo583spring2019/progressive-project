import Table from "../Table";
import wakemed_drg from '../../data/wakemed/drg';

class WakeMedTable extends Table {
    tableData = wakemed_drg
    columns = [
        { title: "code", field: "drg_code" },
        { title: "description", field: "drg_description" },
        { title: "average price", field: "avg_price" },
    ]
    tableHeader = "Wake Med DRG"
}

export default WakeMedTable;