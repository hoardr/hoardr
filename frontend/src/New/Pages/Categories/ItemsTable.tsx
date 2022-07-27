import {Columns, Table} from "../../Components/Table";
import {Item, Unit} from "../../../Api/Types";
import {Link} from "react-router-dom";
import {ancestorPath} from "../../util";
import {IconText} from "../../Components/IconText";
import {FolderIcon, ShoppingCartIcon, ViewGridIcon} from "@heroicons/react/outline";

function sum(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0)
}

function quantity(quantity: number, unit: Unit, locations: number) {
    return `${quantity} ${quantity === 1 ? unit.singular : unit.plural} in ${locations} ${locations === 1 ? 'location' : 'locations'}`
}

const columns: Columns<Item> = [
    {
        key: "name",
        title: <IconText icon={ViewGridIcon}>Name</IconText>,
        render: (item) => <><Link to={`/items/${item.id}`}
                                    className={"text-blue-700 hover:text-blue-900"}>{item.name}</Link>
            <div className={"text-gray-500"}>{item.description}</div>
        </>
    },
    {
        key: "category",
        title: <IconText icon={FolderIcon}>Category</IconText>,
        render: (item) => <><Link to={`/categories/${item.category.id}`}
                                    className={"text-blue-700 hover:text-blue-900"}>{ancestorPath(item.category)}</Link>
            <div className={"text-gray-500"}>{item.category.description}</div>
        </>
    },
    {
        key: "stock",
        title: <IconText icon={ShoppingCartIcon}>Stock</IconText>,
        render: (item) => {
            return quantity(sum(item.stock.map(s => s.quantity)), item.unit, item.stock.length)
        }
    },
    {
        key: "Edit",
        title: <span className="sr-only">Edit</span>,
        className: "text-right",
        render: (item) => <a href="src/New/Pages/Categories/Categories#" className="text-blue-700 hover:text-blue-900">Edit</a>
    },
]

export function ItemsTable({items}: {items: Item[]}) {
    return <Table keyIndex={"id"} columns={columns} data={items}/>
}
