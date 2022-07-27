import {Columns, Table, TableRecord} from "../../Components/Table";
import {Category, Property} from "../../../Api/Types";

const columns: Columns<Property> = [
    {
        title: "Name",
        render: (prop) => <span>{prop.name}</span>
    },
    {
        title: "Type",
        render: (prop) => <span>{prop.type}</span>
    },
]

export function PropertiesTable({properties}: {properties: Property[]}) {
    const data: TableRecord<Property, Category>[] = []
    let last: Property | null = null
    properties.forEach(p => {
        if (last?.category?.id !== p.category?.id) {
            data.push({tableRecordType: 'group', ...p.category, render: () => p.category.name})
        }
        data.push(p)
        last = p
    })
    return <Table keyIndex={"id"} columns={columns} data={data} />
}
