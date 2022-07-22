import React from "react";
import {PageContent, useStore} from "../../App";
import {Outlet} from "react-router-dom";
import {useParams} from "react-router";
import {MenuSidebar} from "../../Components/MenuSidebar";
import {observer} from "mobx-react-lite";


export default function Categories() {
    return <PageContent sidebar={<CategoriesSidebar/>}>
        <Outlet/>
    </PageContent>
}

const CategoriesSidebar = observer(() => {
    const {categoryStore: {categories}} = useStore()
    const params = useParams()

    return <MenuSidebar items={categories.map(c => ({key: c.id, linkTo: `/categories/${c.id}`, name: c.name}))}
                        selectedKey={params.id}
                        indexLinkTo={"/categories"}/>
});
