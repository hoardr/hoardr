import {gql} from "graphql-request";
import {useGraphQLClient} from "../../App";
import React, {useEffect, useState} from "react";
import {Location} from "../../Api/Types";
import {Breadcrumb, Spin} from "antd";
import {LocationsCard} from "./LocationsCard";

export const GET_ALL_LOCATIONS = gql`query {
    locations {
        id
        name
        allItems { id name category { id name } location { id name } }
        children { id name }
        items { id name }
        parent { id name }
    }
}`

export function LocationsView() {
    const client = useGraphQLClient()
    const [locations, setLocations] = useState<Location[] | undefined>(undefined)
    const [reloadFlag, setReloadFlag] = useState(false)
    useEffect(() => {
        if (reloadFlag) {
            setReloadFlag(false)
            return
        }
        client.request<{ locations: Location[] }>(GET_ALL_LOCATIONS).then(value => {
            setLocations(value.locations)
        })
    }, [client, reloadFlag, setReloadFlag])
    if (locations === undefined) return <Spin/>

    return <>
        <Breadcrumb style={{margin: '16px 0'}}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Locations</Breadcrumb.Item>
        </Breadcrumb>
        <LocationsCard locations={locations} onUpdate={() => {
            setReloadFlag(true)
        }}/>
    </>
}
