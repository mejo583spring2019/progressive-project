import Table from "../Table";
import duke_drg from '../../data/duke/drg';

class DukeTable extends Table {
    tableData = duke_drg
    columns = [
        { title: "code", field: "drg_code" },
        { title: "description", field: "drg_description" },
        { title: "average price", field: "avg_price" },
    ]
    tableHeader = "Duke University DRG"
}

export default DukeTable;