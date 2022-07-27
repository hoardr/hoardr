import {Columns, Table} from "../../Components/Table";
import {StockItem, Unit} from "../../../Api/Types";
import {Link} from "react-router-dom";
import {ancestorPath} from "../../util";
import {LocationMarkerIcon} from "@heroicons/react/outline";
import {IconText} from "../../Components/IconText";

function quantity(quantity: number, unit: Unit) {
    return `${quantity} ${quantity === 1 ? unit.singular : unit.plural}`
}

export function StockTable({stockItems, unit}: { stockItems: StockItem[], unit: Unit }) {
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
            render: (stockItem) => <span className={"text-gray-500"}>{quantity(stockItem.quantity, unit)}</span>
        },
        {
            key: "Edit",
            title: <span className="sr-only">Edit</span>,
            className: "text-right",
            render: (stockItem) => <a href="src/New/Pages/Categories/Categories#"
                                      className="text-blue-700 hover:text-blue-900">Edit</a>
        },
    ]

    return <Table keyIndex={(stockItem) => stockItem.location.id} columns={columns} data={stockItems}/>
}
