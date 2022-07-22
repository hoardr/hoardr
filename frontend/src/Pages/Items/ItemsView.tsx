import {gql} from "graphql-request";
import React, {useEffect, useState} from "react";
import {Item} from "../../Api/Types";
import {Breadcrumb, Spin} from "antd";
import {ItemsCard} from "../../Components/Item/ItemsCard";
import {useApi} from "../../Api";

export const GET_ALL_ITEMS = gql`query {
    items {
        id
        name
        category { id name }
        location { id name }
    }
}`

export function ItemsView() {
    const api = useApi()
    const [items, setItems] = useState<Item[] | undefined>(undefined)
    const [reloadFlag, setReloadFlag] = useState(false)
    useEffect(() => {
        if (reloadFlag) {
            setReloadFlag(false)
            return
        }
        api.request<{ items: Item[] }>(GET_ALL_ITEMS).then(value => {
            setItems(value.items)
        })
    }, [api, reloadFlag, setReloadFlag])
    if (items === undefined) return <Spin/>

    return <>
        <Breadcrumb style={{margin: '16px 0'}}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Items</Breadcrumb.Item>
        </Breadcrumb>
        <ItemsCard items={items} onUpdate={() => setReloadFlag(true)}/>
    </>
}
