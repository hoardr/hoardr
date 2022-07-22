import {Key, ReactNode} from "react";
import {classNames} from "../../Util/classNames";

export type Column<RecordType> = {
    key: Key,
    title: ReactNode,
    render: (record: RecordType, index: number) => ReactNode,
    className?: string
};
export type Columns<RecordType> = Column<RecordType>[]
export type TableProps<RecordType> = {
    keyIndex: keyof RecordType,
    columns: Columns<RecordType>,
    data: RecordType[]
}

export function Table<RecordType>({keyIndex, columns, data}: TableProps<RecordType>) {
    return <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
        <tr>
            {columns.map((column) => (
                <th key={column.key}
                    scope="col"
                    className="sticky bg-blue-50 bg-opacity-75 top-0 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {column.title}
                </th>
            ))}
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
        {data.map((row, rowIdx) => (
            <tr key={row[keyIndex] as unknown as Key} className={classNames(rowIdx % 2 == 1 ? "bg-gray-50" : "")}>
                {columns.map((column) => (
                    <td key={column.key}
                        className={classNames("whitespace-nowrap px-3 py-4 text-sm", column.className)}>{column.render(row, rowIdx)}</td>
                ))}
            </tr>
        ))}
        </tbody>
    </table>
}
