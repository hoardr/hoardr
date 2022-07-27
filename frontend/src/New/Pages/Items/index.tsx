import React, {useEffect, useState} from 'react';
import {Route, Routes, useParams} from "react-router-dom";
import {useApi} from "../../../Api";
import {Item} from "../../../Api/Types";
import {PageContent} from "../../Layout";
import {Button} from "../../Components/Button";
import {LinkIcon, PencilIcon, PlusIcon} from "@heroicons/react/solid";
import {Card} from "../../Components/Card";
import {Tab, Tabs} from "../../Components/Tabs";
import {ShoppingCartIcon, ViewListIcon} from "@heroicons/react/outline";
import {ItemsTable} from "../Categories/ItemsTable";
import {AuditLogTable} from "../Categories/AuditLog";
import {PageHeading} from "../../Components/pageHeading";
import {StockTable} from "./StockTable";


export function Items() {
    return <Routes>
        <Route path={":id/*"} element={<DetailView/>}/>
        <Route index element={<IndexView/>}/>
    </Routes>
}


function IndexView() {
    const api = useApi()
    const [items, setItems] = useState<Item[]>()
    useEffect(() => {
        api.item.getAll().then(setItems)
    }, [setItems, api.item])
    if (!items) return null;
    return <PageContent>
        <article className="py-2 px-1 md:px-4 h-full max-h-full">
            <PageHeading title={"Items"}
                         meta={"All items"}
                         extra={<HeadingButtons/>}/>
            <div className={"my-4 shadow rounded overflow-hidden"}>
                <ItemsTable items={items}/>
            </div>
        </article>
    </PageContent>
}

function HeadingButtons() {
    return <div className="mt-5 flex lg:mt-0 lg:ml-4">
        <Button icon={PencilIcon}>Edit</Button>
        <Button icon={LinkIcon} className={"ml-1 sm:ml-3"}>View</Button>
        <Button icon={PlusIcon} className={"ml-1 sm:ml-3"} type={'primary'}>New item</Button>
    </div>;
}

function ItemCard({item}: { item: Item }) {
    //const properties: Property[] = collectFromAncestors(item, 'properties', 'category')
    return <article className={"py-2 h-full max-h-full text-sm font-normal"}>
        <Card header={<Card.Title title={item.name} subTitle={item.description}/>}>
            {/*<div className={"-mx-6 -my-6"}>
                <PropertiesTable properties={properties} />
            </div>*/}
        </Card>
    </article>
}

function DetailView() {
    const api = useApi()
    const {id} = useParams()
    const [item, setItem] = useState<Item>()
    useEffect(() => {
        api.item.get(Number(id)).then(setItem)
    }, [id, setItem, api.item])
    if (!item) return null;
    const tabs: Tab[] = [{
        name: "Stock",
        icon: ShoppingCartIcon,
        href: `/items/${item.id}`,
        aside: <Button type={"primary"} icon={PlusIcon}>New subcategory</Button>
    }, {
        name: "Log",
        icon: ViewListIcon,
        href: `/items/${item.id}/log`,
    }]
    return <PageContent sidebar={<ItemCard item={item}/>}>
        <article className="py-2 h-full max-h-full">
            <Card header={<Tabs tabs={tabs} className={"-mx-4 my-0 md:-my-4"}/>} noDivider>
                <div className={"-mx-6 -my-6"}>
                    <Routes>
                        {/* TODO */}
                        {/*<Route path={"items"} element={<ItemsTable items={collectFromAncestors(item, 'items', 'category')}/>}/>*/}
                        <Route path={"log"} element={<AuditLogTable events={item.auditLog}/>}/>
                        <Route index element={<StockTable stockItems={item.stock}/>}/>
                    </Routes>
                </div>
            </Card>
        </article>
    </PageContent>
}
