import {Columns, Table} from "../../Components/Table";
import {StockItem, Unit} from "../../../Api/Types";
import {Link} from "react-router-dom";
import {ancestorPath} from "../../util";
import {IconText} from "../../Components/IconText";
import {ItemIcon, LocationIcon} from "../../Layout/icons";

function quantity(quantity: number, unit: Unit) {
    return `${quantity} ${quantity === 1 ? unit.singular : unit.plural}`
}

export function StockTable({
    stockItems,
    unit,
    columns: selectedColumns = ['location']
}: { stockItems: StockItem[], unit?: Unit, columns?: ("location" | "item")[] }) {
    const selected = [...selectedColumns, 'quantity', 'edit']
    const columns: Columns<StockItem> = [
        {
            key: "location",
            title: <IconText icon={LocationIcon}>Location</IconText>,
            render: (stockItem) => <><Link to={`/locations/${stockItem.location.id}`}
                                           className={"text-blue-700 hover:text-blue-900"}>{ancestorPath(stockItem.location)}</Link>
                <div className={"text-gray-500"}>{stockItem.location.description}</div>
            </>
        }, {
            key: "item",
            title: <IconText icon={ItemIcon}>Item</IconText>,
            render: (stockItem) => <><Link to={`/items/${stockItem.item.id}`}
                                           className={"text-blue-700 hover:text-blue-900"}>{stockItem.item.name}</Link>
                <div className={"text-gray-500"}>{stockItem.item.description}</div>
            </>
        },
        {
            key: "quantity",
            title: "Quantity",
            render: (stockItem) => <span
                className={"text-gray-500"}>{quantity(stockItem.quantity, unit ?? stockItem.item.unit)}</span>
        },
        {
            key: "edit",
            title: <span className="sr-only">Edit</span>,
            className: "text-right",
            render: (stockItem) => <a href="src/New/Pages/Categories/Categories#"
                                      className="text-blue-700 hover:text-blue-900">Edit</a>
        },
    ]

    const filtered = columns.filter(c => selected.includes(c.key as string))
    console.dir(stockItems)
    return <Table keyIndex={(stockItem) => stockItem.location?.id ?? stockItem.item.id} columns={filtered}
                  data={stockItems}/>
}
