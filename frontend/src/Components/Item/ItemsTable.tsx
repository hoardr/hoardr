import {ColumnsType} from "antd/lib/table";
import {Category, Item, Location} from "../../Api/Types";
import {CategoryLink} from "../Category/CategoryLink";
import React from "react";
import {ConfigProvider, Empty, Table, Typography} from "antd";
import {LocationLink} from "../Location/LocationLink";
import {ItemLink} from "./ItemLink";

export function itemColumns(actions?: (item: Item) => React.ReactNode, category?: Category, location?: Location): ColumnsType<Item> {
    return [
        {
            title: "Name",
            dataIndex: "name",
            render: (_, item) => <ItemLink to={item}/>
        },
        {
            title: "Category",
            dataIndex: "category",
            render: value => <Typography.Text strong={category?.id === value.id}><CategoryLink to={value}/></Typography.Text>
        },
        {
            title: "Location",
            dataIndex: "location",
            render: value => <Typography.Text strong={location?.id === value.id}><LocationLink to={value}/></Typography.Text>
        }
    ]
}

export function ItemsTable({items, location, category}: { items: Item[], location?: Location, category?: Category }) {
    return <ConfigProvider renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No items"}/>}>
        <Table
            bordered={false}
            size={"small"}
            dataSource={items}
            expandable={{childrenColumnName: "___"}}
            columns={itemColumns()}/>
    </ConfigProvider>
}
