import {Columns, Table} from "../../Components/Table";
import {Category, Location} from "../../../Api/Types";
import {Link} from "react-router-dom";

const columns: Columns<Location> = [
    {
        title: "Name",
        render: (location) => <Link to={`/categories/${location.id}`}
                                    className={"text-blue-700 hover:text-blue-900"}>{location.name}</Link>
    },
    {
        title: "Description",
        render: (location) => <span className={"text-gray-500"}>{location.description}</span>
    },
    {
        title: "Items",
        render: (location) => <Link to={`/categories/${location.id}/items`} className={"text-blue-700 hover:text-blue-900"}>{location.items?.length ?? 0} items</Link>
    },
    {
        key: "Edit",
        title: <span className="sr-only">Edit</span>,
        className: "text-right",
        render: (location) => <a href="src/New/Pages/Categories/Categories#" className="text-blue-700 hover:text-blue-900">Edit</a>
    },
]

export function LocationsTable({locations}: {locations: Location[]}) {
    return <Table keyIndex={"id"} columns={columns} data={locations}/>
}
