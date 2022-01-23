import {Item, ItemProperty} from "../../Api/Types";
import {ColumnsType} from "antd/lib/table";
import {Card, ConfigProvider, Empty, Space, Table, Typography} from "antd";
import React from "react";
import {CategoryLink} from "../../Components/Category/CategoryLink";
import {SetPropertyValue} from "./ItemPropertiesTableActions";

export function ItemPropertiesTable({item, onUpdate}: { item: Item, onUpdate: () => void }) {
    const allProps = item.allProperties

    const columns: ColumnsType<ItemProperty> = [
        {
            title: "Name",
            key: "name",
            render: (_, value) => value.property.name
        },
        {
            title: "Type",
            dataIndex: "type",
            render: (_, value) => value.property.type
        },
        {
            title: "Value",
            render: (_, value) => item.propertyValues.find(p => p.property.id === value.property.id)?.value ??
                <Typography.Text disabled>No value</Typography.Text>
        },
        {
            title: "Source",
            dataIndex: "category",
            render: (category) => {
                return category ? <CategoryLink to={category}/> : "none"
            }
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, itemProp) => <Space>
                <SetPropertyValue item={item} property={itemProp.property}
                                  currentValue={item.propertyValues.find(p => p.property.id === itemProp.property.id)?.value}
                                  onUpdate={onUpdate} />
            </Space>
        }
    ]

    return <Table bordered={false} size={"small"} dataSource={allProps} columns={columns} rowKey={"id"}/>;
}

export function ItemPropertiesCard({
    item,
    onUpdate
}: { item: Item, onUpdate: () => void }) {
    return <Card bordered={false} title={"Properties"}
        /*extra={<NewPropertyButton category={item} onUpdate={onUpdate}/>}*/>
        <ConfigProvider renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No items"}/>}>
            <ItemPropertiesTable item={item} onUpdate={onUpdate}/>
        </ConfigProvider>
    </Card>
}
