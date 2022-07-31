import {Columns, Table} from "../../Components/Table";
import {Category, Location} from "../../../Api/Types";
import {Link} from "react-router-dom";
import {IconText} from "../../Components/IconText";
import {FolderIcon, LocationMarkerIcon, ViewGridIcon} from "@heroicons/react/outline";
import {ancestorPath, quantity} from "../../util";

const columns: Columns<Location> = [
    {
        key: "Name",
        title: <IconText icon={LocationMarkerIcon}>Name</IconText>,
        render: (location) => <Link to={`/locations/${location.id}`}
                                    className={"text-blue-700 hover:text-blue-900"}>{ancestorPath(location)}</Link>
    },
    {
        title: "Description",
        render: (location) => <span className={"text-gray-500"}>{location.description}</span>
    },
    {
        key: "Items",
        title: <IconText icon={ViewGridIcon}>Items</IconText>,
        render: (location) => <Link to={`/locations/${location.id}/items`} className={"text-blue-700 hover:text-blue-900"}>{quantity(location.stock?.length ?? 0, "item", "items")}</Link>
    },
    {
        key: "Edit",
        title: <span className="sr-only">Edit</span>,
        className: "text-right",
        render: (location) => <a href="#" className="text-blue-700 hover:text-blue-900">Edit</a>
    },
]

export function LocationsTable({locations}: {locations: Location[]}) {
    return <Table keyIndex={"id"} columns={columns} data={locations}/>
}
