import React, {ReactNode, useCallback, useState} from "react";
import {useGraphQLClient} from "../../App";
import {debounce} from "lodash-es";
import {Select, Typography} from "antd";

export type SelectProps<T extends EntityWithAllParents> = React.ComponentProps<typeof Select> & { initialValue?: T }
export type SearchSelectProps<T extends EntityWithAllParents> =
    SelectProps<T>
    & { search: (name: string) => Promise<T[]> }

type Entity = { id: number, name: string }
type EntityWithAllParents = Entity & { allParents: Entity[] }

function label(value: Entity, parents: Entity[]): ReactNode {
    const prefix = parents.length > 0 ? (parents.map(x => x.name).join("/") + "/") : ""
    return <>{prefix}<Typography.Text strong>{value.name}</Typography.Text></>
}

export function SearchSelect<T extends EntityWithAllParents>({
    value, onChange, initialValue, search, ...props
}: SearchSelectProps<T>) {
    const [data, setData] = useState<T[]>(initialValue ? [initialValue] : [])
    const client = useGraphQLClient()
    const loadData = useCallback(debounce((name: string) => {
        if (name) {
            search(name).then(values => {
                setData(values)
            })
        }
    }, 300), [setData, client])
    return <Select
        showSearch
        showArrow={false}
        filterOption={false}
        defaultActiveFirstOption={false}
        onSearch={loadData}
        onChange={onChange}
        value={value}
        allowClear={true}
        options={data.map(d => {
            return {label: label(d, d.allParents), value: d.id}
        })}
        {...props}
    />
}
