import {Columns, Table} from "../../Components/Table";
import {StockItem} from "../../../Api/Types";
import {Link} from "react-router-dom";
import {ancestorPath} from "../../util";
import {LocationMarkerIcon} from "@heroicons/react/outline";
import {IconText} from "../../Components/IconText";

const columns: Columns<StockItem> = [
    {
        key: "location",
        title: <IconText icon={LocationMarkerIcon}>Location</IconText>,
        render: (stockItem) => <><Link to={`/locations/${stockItem.location.id}`}
                                     className={"text-blue-700 hover:text-blue-900"}>{ancestorPath(stockItem.location)}</Link>
            <div className={"text-gray-500"}>{stockItem.location.description}</div>
        </>
    },
    {
        title: "Quantity",
        render: (stockItem) => <span className={"text-gray-500"}>{stockItem.quantity}</span>
    },
    {
        key: "Edit",
        title: <span className="sr-only">Edit</span>,
        className: "text-right",
        render: (stockItem) => <a href="src/New/Pages/Categories/Categories#"
                                  className="text-blue-700 hover:text-blue-900">Edit</a>
    },
]

export function StockTable({stockItems}: { stockItems: StockItem[] }) {
    return <Table keyIndex={(stockItem) => stockItem.location.id} columns={columns} data={stockItems}/>
}
