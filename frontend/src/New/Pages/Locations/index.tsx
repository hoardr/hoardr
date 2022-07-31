import {Route, Routes, useParams} from "react-router-dom";
import {useApi} from "../../../Api";
import React, {useEffect, useState} from "react";
import {Location} from "../../../Api/Types";
import {buildBreadcrumbs, buildBreadcrumbsFromAncestors, PageContent} from "../../Layout";
import {PageHeading} from "../../Components/PageHeading";
import {FormButton} from "../../Components/FormButton";
import {PlusIcon} from "@heroicons/react/solid";
import {NewItemForm} from "../../Components/NewItemForm";
import {Card} from "../../Components/Card";
import {Tab, Tabs} from "../../Components/Tabs";
import {LocationMarkerIcon, ShoppingCartIcon, ViewListIcon} from "@heroicons/react/outline";
import {Button} from "../../Components/Button";
import {AuditLogTable} from "../Categories/AuditLog";
import {LocationsTable} from "./LocationsTable";

export function Locations() {
    return <Routes>
        <Route path={":id/*"} element={<DetailView/>}/>
        <Route index element={<IndexView/>}/>
    </Routes>
}


function IndexView() {
    const api = useApi()
    const [locations, setLocations] = useState<Location[]>()
    useEffect(() => {
        api.location.getRoot().then(setLocations)
    }, [setLocations, api.item])
    if (!locations) return null;
    return <PageContent breadcrumbs={buildBreadcrumbs({name: "Locations", href: "/locations"})}>
        <article className="py-2 px-1 md:px-4 h-full max-h-full">
            <PageHeading title={"Locations"}
                         meta={"All top-level locations"}
                         extra={<HeadingButtons/>}/>
            <div className={"my-4 shadow rounded overflow-hidden"}>
                <LocationsTable locations={locations}/>
            </div>
        </article>
    </PageContent>
}

function HeadingButtons() {
    return <div className="mt-5 flex lg:mt-0 lg:ml-4">
        <FormButton title={"New item"} submit={"Add"} icon={PlusIcon} subTitle={"Add a new item"}>
            {({formRef}) => <NewItemForm formRef={formRef}/>}
        </FormButton>
    </div>;
}

function LocationCard({location}: { location: Location }) {
    //const properties: Property[] = collectFromAncestors(item, 'properties', 'category')
    return <article className={"py-2 h-full max-h-full text-sm font-normal"}>
        <Card header={<Card.Title title={location.name} subTitle={location.description}/>}>
            {/*<div className={"-mx-6 -my-6"}>
                <PropertiesTable properties={properties} />
            </div>*/}
        </Card>
    </article>
}

function DetailView() {
    const api = useApi()
    const {id} = useParams()
    const [location, setLocation] = useState<Location>()
    useEffect(() => {
        api.location.get(Number(id)).then(setLocation)
    }, [id, setLocation, api.item])
    if (!location) return null;
    const tabs: Tab[] = [{
        name: "Sublocations",
        icon: LocationMarkerIcon,
        href: `/locations/${location.id}`,
        aside: <Button type={"success"} icon={PlusIcon}>New location</Button>
    }, {
        name: "Stock",
        icon: ShoppingCartIcon,
        href: `/locations/${location.id}/stock`,
    }, {
        name: "Log",
        icon: ViewListIcon,
        href: `/locations/${location.id}/log`,
    }]
    return <PageContent sidebar={<LocationCard location={location}/>}
                        breadcrumbs={buildBreadcrumbsFromAncestors({name: "Locations", href: "/locations"}, location)}>
        <article className="py-2 h-full max-h-full">
            <Card header={<Tabs tabs={tabs} className={"-mx-4 my-0 md:-my-4"}/>} noDivider>
                <section className={"-mx-6 -my-6"}>
                    <Routes>
                        <Route path={"log"} element={<AuditLogTable events={location.auditLog}/>}/>
                        <Route path={"stock"} element={<AuditLogTable events={location.auditLog}/>}/>
                        <Route index element={<LocationsTable locations={location.children}/>}/>
                    </Routes>
                </section>
            </Card>
        </article>
    </PageContent>
}
