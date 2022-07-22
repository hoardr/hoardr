import {PageContent, useStore} from "../../App";
import {Outlet} from "react-router-dom";
import React from "react";
import {observer} from "mobx-react-lite";
import {useParams} from "react-router";
import {MenuSidebar} from "../../Components/MenuSidebar";

const ItemsSidebar = observer(() => {
    const {itemStore: {items}} = useStore()
    const params = useParams()

    return <MenuSidebar items={items.map(c => ({key: c.id, linkTo: `/items/${c.id}`, name: c.name}))}
                        selectedKey={params.id}
                        indexLinkTo={"/items"}/>
});

export default function Items() {
    return <PageContent sidebar={<ItemsSidebar />}>
        <Outlet/>
    </PageContent>
}
