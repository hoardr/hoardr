import React from "react";
import {ColumnsType} from "antd/lib/table";
import {Space, Typography} from "antd";
import {Location} from "../../Api/Types";
import {TableConfirmButton} from "../../Util/TableConfirmButton";
import {BiTrash, BiUnlink} from "react-icons/bi";
import {useApi} from "../../Api";
import {LocationLink} from "../../Components/Location/LocationLink";
import {ItemsDrawer} from "../../Components/Item/ItemsDrawer";

export function locationColumns(actions?: (location: Location) => React.ReactNode): ColumnsType<Location> {
    const columns: ColumnsType<Location> = [
        {
            title: "Name",
            dataIndex: "name",
            render: (value, record) => <LocationLink to={record}/>
        },
        {
            title: "Parent",
            dataIndex: "parent",
            render: value => (value && <LocationLink to={value}/>) ||
                <Typography.Text disabled>(root)</Typography.Text>
        },
        {
            title: "Items",
            key: "items",
            render: (_, record) => "hi" //<ItemsDrawer items={record.items} allItems={record.allItems}/>
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

export function RemoveChildLocation({
    child,
    onUpdate,
    parent
}: { child: Location, onUpdate: () => void, parent: Location }) {
    const api = useApi()
    return <TableConfirmButton confirmTitle={`Remove ${child.name} from child locations of ${parent.name}?`}
                               icon={<BiUnlink size={20}/>}
                               tooltip={"Remove child location"}
                               onConfirm={async () => {
                                   await api.location.setParent(child.id)
                                   onUpdate()
                               }}
                               type={"error"}/>
}

export function DeleteLocation({location, onUpdate}: { location: Location, onUpdate: () => void }) {
    const api = useApi()
    return <TableConfirmButton
        confirmTitle={<>Delete {location.name}?<br/>This will delete all {location.stock.length} items in here.<br/>Any
            child locations are unaffected.</>}
        icon={<BiTrash size={20}/>}
        tooltip={"Delete location"}
        onConfirm={async () => {
            await api.location.delete(location.id)
            onUpdate()
        }}
        type={"error"}/>
}

