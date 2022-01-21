import {gql} from "graphql-request";
import {useGraphQLClient} from "../../App";
import React, {ReactNode, useState} from "react";
import {Item} from "../../Api/Types";
import {Button, Col, Empty, PageHeader, Row, Spin, Tabs, Typography} from "antd";
import {BreadCrumbs} from "./BreadCrumbs";
import {Link, useParams} from "react-router-dom";
import {useAsyncMemo} from "../../Util/useAsyncMemo";
import {ItemPropertiesCard} from "./ItemPropertiesCard";

export const GET_ITEM = gql`query($id: Int!) {
    items(id: $id) {
        id
        name
        category { id name }
        location { id name }
        events { id type data createdDate }
        allProperties { property { id name type } category { id name } }
        propertyValues { id value property { id name type } }
        createdDate
    }
}`

type TabContentProps = { item: Item, reloadData: () => void }
type TabContentRenderer = (item: Item, reloadData: () => void) => ReactNode

const tabs: { [key: string]: TabContentRenderer } = {
    "details": (item, reloadData) => <DetailsTab item={item} reloadData={reloadData}/>,
    // "events": (item, reloadData) => <EventsTab item={item} reloadData={reloadData}/>,
    // "childLocations": (item, reloadData) => <ChildLocationsTab item={item} reloadData={reloadData}/>
}

function DetailsTab({item, reloadData}: TabContentProps) {
    return <>
        {/*<Col span={12} style={{margin: "16px 0"}}>*/}
        {/*    <ItemsCard items={item.allItems} onUpdate={reloadData} initialValues={{item: item}}/>*/}
        {/*</Col>*/}
        <Col span={12} style={{margin: "16px 0"}}>
            <ItemPropertiesCard item={item} onUpdate={reloadData}/>
        </Col>
    </>
}

//
// function ChildLocationsTab({item, reloadData}: TabContentProps) {
//     return <Col span={24} style={{margin: "16px 0"}}>
//         <ChildLocationsCard children={item.children} onUpdate={reloadData} parent={item}/>
//     </Col>
// }
//
// function EventsTab({item}: TabContentProps) {
//     return <Col span={24} style={{margin: "16px 0"}}>
//         <Card bordered={false} title={"Events"}>
//             <LocationEventsTable events={item.events}/>
//         </Card>
//     </Col>
// }

export function ItemDetailsView() {
    const client = useGraphQLClient()
    const id = parseInt(useParams().id!!)
    const [reloadFlag, setReloadFlag] = useState<boolean>(false)
    const [selectedTab, setSelectedTab] = useState<string>("details")
    const [{loading, value: item}, reloadData] = useAsyncMemo(async () => {
        if (reloadFlag) {
            setReloadFlag(false)
            return
        }
        return (await client.request<{ items: Item[] }>(GET_ITEM, {id})).items[0]
    }, [client, id, reloadFlag, setReloadFlag])

    if (loading) return <Spin/>
    if (!item) return <Empty description={"No items found"}>
        <Button type={"primary"}><Link to={"/items"}>Back to items</Link></Button>
    </Empty>
    return <>
        <BreadCrumbs item={item}/>
        <PageHeader
            title={<Typography.Title>{item.name}</Typography.Title>}
            className={"site-layout-background"}
            footer={<Tabs size={"large"} onChange={(key) => {
                setSelectedTab(key)
            }}>
                <Tabs.TabPane tab={"Details"} key={"details"}/>
                <Tabs.TabPane tab={"Child locations"} key={"childLocations"}/>
                <Tabs.TabPane tab={"Events"} key={"events"}/>
            </Tabs>}
        />
        <Row gutter={16}>
            {tabs[selectedTab](item, reloadData)}
        </Row>
    </>
}
