import {Key, ReactNode} from "react";
import {classNames} from "../../Util/classNames";

export type TableRecordType = undefined | 'group'
export type TableRecord<T, G> = DataRecord<T> | GroupRecord<G>
export type DataRecord<T> = GenericTableRecord<T, undefined>
export type GenericTableRecord<R, T extends TableRecordType> = R & {tableRecordType?: T}
export type GroupRecord<G> = GenericTableRecord<any, 'group'> & Omit<Column<never>, 'render'> & {render: () => ReactNode}

export type Column<T> = {
    key?: Key,
    title: ReactNode,
    render: (record: T, index: number) => ReactNode,
    className?: string
};
export type Columns<T> = Column<T>[]
export type TableProps<T, G> = {
    keyIndex: keyof T | ((record: T, index: number) => Key),
    columns: Columns<T>,
    data: TableRecord<T, G>[]
}

// export type TableRecord<T> = Omit<Column<never>, 'render'> & {group: true, render: () => ReactNode} | RecordType

export function Table<T, G = any>({keyIndex, columns, data}: TableProps<T, G>) {
    let rowIdx = 0
    return <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
        <tr>
            {columns.map((column) => (
                <th key={typeof column.title === 'string' ? column.title : column.key}
                    scope="col"
                    className="sticky bg-gray-50 bg-opacity-75 top-0 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {column.title}
                </th>
            ))}
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white text-gray-700">
        {data.map((row, recordIdx) => {
            if (row.tableRecordType === 'group') {
                rowIdx = 0;
                return <tr key={row.name} className={"shadow-md"}>
                    <td colSpan={columns.length} className={"whitespace-nowrap px-3 py-2 text-sm font-bold bg-gray-100"}>{row.render()}</td>
                </tr>
            }
            const key = typeof keyIndex === 'function' ? keyIndex(row, recordIdx) : row[keyIndex]
            return (
                <tr key={key} className={classNames(rowIdx++ % 2 === 1 ? "bg-gray-50" : "")}>
                    {columns.map((column) => (
                        <td key={typeof column.title === 'string' ? column.title : column.key}
                            className={classNames("whitespace-nowrap px-3 py-4 text-sm", column.className)}>{column.render(row, recordIdx)}</td>
                    ))}
                </tr>
            );
        })}
        </tbody>
    </table>
}
