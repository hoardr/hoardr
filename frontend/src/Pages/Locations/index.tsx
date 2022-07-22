import {PageContent, useStore} from "../../App";
import {Outlet} from "react-router-dom";
import React from "react";
import {observer} from "mobx-react-lite";
import {useParams} from "react-router";
import {MenuSidebar} from "../../Components/MenuSidebar";

const LocationsSidebar = observer(() => {
    const {locationStore: {locations}} = useStore()
    const params = useParams()

    return <MenuSidebar items={locations.map(c => ({key: c.id, linkTo: `/locations/${c.id}`, name: c.name}))}
                        selectedKey={params.id}
                        indexLinkTo={"/locations"}/>
});

export default function Locations() {
    return <PageContent sidebar={<LocationsSidebar />}>
        <Outlet/>
    </PageContent>
}
