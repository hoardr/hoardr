import {gql} from "graphql-request";
import React, {ReactNode, useEffect, useState} from "react";
import {Category} from "../../Api/Types";
import {Button, Card, Col, Empty, PageHeader, Row, Spin, Tabs, Typography} from "antd";
import {BreadCrumbs} from "./BreadCrumbs";
import {CategoryPropertiesCard} from "./CategoryProperties";
import {Link, useParams} from "react-router-dom";
import {CategoryEventsTable} from "./CategoryEventsTable";
import {ChildCategoriesCard} from "./CategoriesCard";
import {ItemsCard} from "../../Components/Item/ItemsCard";
import {CategoryModel} from "../../State";
import {useStore} from "../../App";

export const GET_CATEGORY = gql`query($id: Int!) {
    categories(id: $id) {
        id
        name
        children { id name parent { id name } children { id name } items { id name } allItems { id name location { id name } category { id name } }  }
        ancestors { id name properties { id name type } }
        properties { id name type }
        events { id type data createdDate }
        allItems { id name category { id name } location { id name } }
        createdDate
    }
}`

type TabContentProps = { category: Category, reloadData: () => void }
type TabContentRenderer = (category: Category, reloadData: () => void) => ReactNode

const tabs: { [key: string]: TabContentRenderer } = {
    "details": (category, reloadData) => <DetailsTab category={category} reloadData={reloadData}/>,
    "events": (category, reloadData) => <EventsTab category={category} reloadData={reloadData}/>,
    "childCategories": (category, reloadData) => <ChildCategoriesTab category={category} reloadData={reloadData}/>
}

function DetailsTab({category, reloadData}: TabContentProps) {
    return <>
        <Col xs={24} lg={12} style={{margin: "16px 0"}}>
            <ItemsCard items={category.allItems} onUpdate={reloadData} initialValues={{category}}/>
        </Col>
        <Col xs={24} lg={12} style={{margin: "16px 0"}}>
            <CategoryPropertiesCard category={category} onUpdate={reloadData}/>
        </Col>
    </>
}

function ChildCategoriesTab({category, reloadData}: TabContentProps) {
    return <Col span={24} style={{margin: "16px 0"}}>
        <ChildCategoriesCard categories={category.children} onUpdate={reloadData} parent={category}/>
    </Col>
}

function EventsTab({category}: TabContentProps) {
    return <Col span={24} style={{margin: "16px 0"}}>
        <Card bordered={false} title={"Events"}>
            <CategoryEventsTable category={category}/>
        </Card>
    </Col>
}

export function CategoryDetailsView() {
    const id = parseInt(useParams().id!!)
    const {categoryStore} = useStore()
    const [selectedTab, setSelectedTab] = useState<string>("details")
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState<typeof CategoryModel>(undefined)
    useEffect(() => {
        categoryStore.getOrLoad(id).then(c => {
            setCategory(c)
            setLoading(false)
        })
    }, [id, setCategory, setLoading])

    if (loading) return <Spin/>
    if (!category) return <Empty description={"No category found"}><Button type={"primary"}><Link to={"/categories"}>Back
        to categories</Link></Button></Empty>
    return <>
        <BreadCrumbs category={category}/>
        <PageHeader
            title={<Typography.Title>{category.name}</Typography.Title>}
            className={"site-layout-background"}
            footer={<Tabs size={"large"} onChange={(key) => {
                setSelectedTab(key)
            }}>
                <Tabs.TabPane tab={"Details"} key={"details"}/>
                <Tabs.TabPane tab={"Child categories"} key={"childCategories"}/>
                <Tabs.TabPane tab={"Events"} key={"events"}/>
            </Tabs>}
        />
        <Row gutter={16}>
            {tabs[selectedTab](category, () => {})}
        </Row>
    </>
}
