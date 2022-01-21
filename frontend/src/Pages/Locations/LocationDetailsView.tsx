import {gql} from "graphql-request";
import {useGraphQLClient} from "../../App";
import React, {ReactNode, useState} from "react";
import {Location} from "../../Api/Types";
import {Button, Card, Col, Empty, PageHeader, Row, Spin, Tabs, Typography} from "antd";
import {BreadCrumbs} from "./BreadCrumbs";
import {Link, useParams} from "react-router-dom";
import {useAsyncMemo} from "../../Util/useAsyncMemo";
import {LocationEventsTable} from "./LocationEventsTable";
import {ChildLocationsCard} from "./LocationsCard";
import {ItemsCard} from "../../Components/Item/ItemsCard";

export const GET_LOCATION = gql`query($id: Int!) {
    locations(id: $id) {
        id
        name
        children { id name parent { id name } children { id name } items { id name } allItems { id name category { id name } }  }
        allParents { id name }
        events { id type data createdDate }
        allItems { id name category { id name } location { id name } }
        createdDate
    }
}`

type TabContentProps = { location: Location, reloadData: () => void }
type TabContentRenderer = (location: Location, reloadData: () => void) => ReactNode

const tabs: { [key: string]: TabContentRenderer } = {
    "details": (location, reloadData) => <DetailsTab location={location} reloadData={reloadData}/>,
    "events": (location, reloadData) => <EventsTab location={location} reloadData={reloadData}/>,
    "childLocations": (location, reloadData) => <ChildLocationsTab location={location} reloadData={reloadData}/>
}

function DetailsTab({location, reloadData}: TabContentProps) {
    return <>
        <Col span={12} style={{margin: "16px 0"}}>
            <ItemsCard items={location.allItems} onUpdate={reloadData} initialValues={{location}}/>
        </Col>
        {/*<Col span={12}>*/}
        {/*    <LocationPropertiesCard category={category} onUpdate={reloadData}/>*/}
        {/*</Col>*/}
    </>
}

function ChildLocationsTab({location, reloadData}: TabContentProps) {
    return <Col span={24} style={{margin: "16px 0"}}>
        <ChildLocationsCard children={location.children} onUpdate={reloadData} parent={location}/>
    </Col>
}

function EventsTab({location}: TabContentProps) {
    return <Col span={24} style={{margin: "16px 0"}}>
        <Card bordered={false} title={"Events"}>
            <LocationEventsTable events={location.events}/>
        </Card>
    </Col>
}

export function LocationDetailsView() {
    const client = useGraphQLClient()
    const id = parseInt(useParams().id!!)
    const [reloadFlag, setReloadFlag] = useState<boolean>(false)
    const [selectedTab, setSelectedTab] = useState<string>("details")
    const [{loading, value: category}, reloadData] = useAsyncMemo(async () => {
        if (reloadFlag) {
            setReloadFlag(false)
            return
        }
        return (await client.request<{ locations: Location[] }>(GET_LOCATION, {id})).locations[0]
    }, [client, id, reloadFlag, setReloadFlag])

    if (loading) return <Spin/>
    if (!category) return <Empty description={"No location found"}>
        <Button type={"primary"}><Link to={"/locations"}>Back to locations</Link></Button>
    </Empty>
    return <>
        <BreadCrumbs item={category}/>
        <PageHeader
            title={<Typography.Title>{category.name}</Typography.Title>}
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
            {tabs[selectedTab](category, reloadData)}
        </Row>
    </>
}
