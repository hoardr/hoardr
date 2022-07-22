import {Space, Typography} from "antd";
import {Category} from "../../Api/Types";
import {ColumnsType} from "antd/lib/table";
import React from "react";
import {BiTrash, BiUnlink} from "react-icons/bi";
import {TableConfirmButton} from "../../Util/TableConfirmButton";
import {useApi} from "../../Api";
import {CategoryLink} from "../../Components/Category/CategoryLink";
import {ItemsDrawer} from "../../Components/Item/ItemsDrawer";

export function categoryColumns(actions?: (category: Category) => React.ReactNode): ColumnsType<Category> {
    const columns: ColumnsType<Category> = [
        {
            title: "Name",
            dataIndex: "name",
            render: (value, record) => <CategoryLink to={record}/>
        },
        {
            title: "Parent",
            dataIndex: "parent",
            render: value => (value && <CategoryLink to={value}/>) ||
                <Typography.Text disabled>(root)</Typography.Text>
        },
        {
            title: "Items",
            key: "items",
            render: (_, record) => <ItemsDrawer items={record.items || []} allItems={record.allItems || []}/>
        }
    ];
    if (actions) {
        columns.push({
            title: "Actions",
            key: "actions",
            render: (_, record) => <Space>{actions(record)}</Space>
        })
    }
    return columns
}

export function RemoveChildCategory({
    child,
    onUpdate,
    parent
}: { child: Category, onUpdate: () => void, parent: Category }) {
    const api = useApi()
    return <TableConfirmButton confirmTitle={`Remove ${child.name} from child categories of ${parent.name}?`}
                               icon={<BiUnlink size={20}/>}
                               tooltip={"Remove child category"}
                               onConfirm={async () => {
                                   await api.category.setParent(child.id, undefined)
                                   onUpdate()
                               }}
                               type={"error"}/>
}

export function DeleteCategory({category, onUpdate}: { category: Category, onUpdate: () => void }) {
    const api = useApi()
    return <TableConfirmButton
        confirmTitle={<>Delete {category.name}?<br/>This will delete all {category.items?.length} items in here.<br/>Any
            child categories are unaffected.</>}
        icon={<BiTrash size={20}/>}
        tooltip={"Delete category"}
        onConfirm={async () => {
            await api.category.delete(category.id)
            onUpdate()
        }}
        type={"error"}/>
}
