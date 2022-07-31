import {Columns, Table} from "../../Components/Table";
import {Category} from "../../../Api/Types";
import {Link} from "react-router-dom";
import {IconText} from "../../Components/IconText";
import {FolderIcon, ViewGridIcon} from "@heroicons/react/outline";
import {quantity} from "../../util";

const columns: Columns<Category> = [
    {
        key: "Name",
        title: <IconText icon={FolderIcon}>Name</IconText>,
        render: (category) => <Link to={`/categories/${category.id}`}
                                    className={"text-blue-700 hover:text-blue-900"}>{category.name}</Link>
    },
    {
        title: "Description",
        render: (category) => <span className={"text-gray-500"}>{category.description}</span>
    },
    {
        key: "Items",
        title: <IconText icon={ViewGridIcon}>Items</IconText>,
        render: (category) => <Link to={`/categories/${category.id}/items`} className={"text-blue-700 hover:text-blue-900"}>{quantity(category.items?.length ?? 0, "item", "items")}</Link>
    },
    {
        key: "Edit",
        title: <span className="sr-only">Edit</span>,
        className: "text-right",
        render: (category) => <a href="src/New/Pages/Categories/Categories#" className="text-blue-700 hover:text-blue-900">Edit</a>
    },
]

export function CategoriesTable({categories}: {categories: Category[]}) {
    return <Table keyIndex={"id"} columns={columns} data={categories}/>
}
