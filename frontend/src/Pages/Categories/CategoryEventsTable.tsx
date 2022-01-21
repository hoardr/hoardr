import {Category, CategoryEvent} from "../../Api/Types";
import React from "react";
import {Table} from 'antd';
import {RelativeDateTime} from "../../Util/RelativeDateTime";
import {ColumnsType} from "antd/lib/table";

const columns: ColumnsType<CategoryEvent> = [
    {
        title: "Time",
        dataIndex: "createdDate",
        render: value => <RelativeDateTime dateTime={value}/>
    },
    {
        title: "Event",
        dataIndex: "type"
    },
    {
        title: "Data",
        dataIndex: "data",
        render: value => JSON.stringify(value)
    }
]

export function CategoryEventsTable({category}: { category: Category }) {
    return <Table
        rowKey={"id"}
        columns={columns}
        dataSource={category.events}
        size={"small"}
    />
}
