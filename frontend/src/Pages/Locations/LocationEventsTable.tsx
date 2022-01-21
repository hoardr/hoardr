import {LocationEvent} from "../../Api/Types";
import React from "react";
import {Table} from 'antd';
import {RelativeDateTime} from "../../Util/RelativeDateTime";
import {ColumnsType} from "antd/lib/table";

const columns: ColumnsType<LocationEvent> = [
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

export function LocationEventsTable({events}: { events: LocationEvent[] }) {
    return <Table
        rowKey={"id"}
        columns={columns}
        dataSource={events}
        size={"small"}
    />
}
