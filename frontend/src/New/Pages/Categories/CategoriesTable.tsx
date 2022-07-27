import {Columns, Table} from "../../Components/Table";
import {Category} from "../../../Api/Types";
import {Link} from "react-router-dom";

const columns: Columns<Category> = [
    {
        title: "Name",
        render: (category) => <Link to={`/categories/${category.id}`}
                                    className={"text-blue-700 hover:text-blue-900"}>{category.name}</Link>
    },
    {
        title: "Description",
        render: (category) => <span className={"text-gray-500"}>{category.description}</span>
    },
    {
        title: "Items",
        render: (category) => <Link to={`/categories/${category.id}/items`} className={"text-blue-700 hover:text-blue-900"}>{category.items?.length ?? 0} items</Link>
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
