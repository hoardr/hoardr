import {PageContent} from "../../App";
import {Outlet} from "react-router-dom";
import React from "react";

export default function Items() {
    return <PageContent>
        <Outlet/>
    </PageContent>
}
