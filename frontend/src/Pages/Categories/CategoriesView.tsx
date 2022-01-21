import {gql} from "graphql-request";
import {useGraphQLClient} from "../../App";
import React, {useEffect, useState} from "react";
import {Category} from "../../Api/Types";
import {Breadcrumb, Spin} from "antd";
import {CategoriesCard} from "./CategoriesCard";

export const GET_ALL_CATEGORIES = gql`query {
    categories {
        id
        name
        allItems { id name category { id name } location { id name } }
        children { id name }
        items { id name }
        parent { id name }
    }
}`

export function CategoriesView() {
    const client = useGraphQLClient()
    const [categories, setCategories] = useState<Category[] | undefined>(undefined)
    const [reloadFlag, setReloadFlag] = useState(false)
    useEffect(() => {
        if (reloadFlag) {
            setReloadFlag(false)
            return
        }
        client.request<{ categories: Category[] }>(GET_ALL_CATEGORIES).then(value => {
            setCategories(value.categories)
        })
    }, [client, reloadFlag, setReloadFlag])
    if (categories === undefined) return <Spin/>

    return <>
        <Breadcrumb style={{margin: '16px 0'}}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Categories</Breadcrumb.Item>
        </Breadcrumb>
        <CategoriesCard categories={categories} onUpdate={() => {
            setReloadFlag(true)
        }}/>
    </>
}
