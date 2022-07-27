import {Columns, Table} from "../../Components/Table";
import {AuditLogEvent} from "../../../Api/Types";

const columns: Columns<AuditLogEvent> = [
    {
        title: "Time",
        render: (event) => <span>{event.createdAt}</span>
    },
    {
        title: "Action",
        render: (event) => <span>{event.action}</span>
    },
    {
        title: "Data",
        render: (event) => <pre>{JSON.stringify(event.data, null, 2)}</pre>
    },
]

export function AuditLogTable({events}: {events: AuditLogEvent[]}) {
    return <Table keyIndex={"id"} columns={columns} data={events}/>
}
