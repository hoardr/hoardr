import {gql} from "graphql-request";
import React, {useEffect, useState} from "react";
import {Location} from "../../Api/Types";
import {Breadcrumb, Spin} from "antd";
import {LocationsCard} from "./LocationsCard";
import {useApi} from "../../Api";

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
    const api = useApi()
    const [locations, setLocations] = useState<Location[] | undefined>(undefined)
    const [reloadFlag, setReloadFlag] = useState(false)
    useEffect(() => {
        if (reloadFlag) {
            setReloadFlag(false)
            return
        }
        api.request<{ locations: Location[] }>(GET_ALL_LOCATIONS).then(value => {
            setLocations(value.locations)
        })
    }, [api, reloadFlag, setReloadFlag])
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
