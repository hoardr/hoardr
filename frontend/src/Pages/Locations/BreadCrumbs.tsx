import {Location} from "../../Api/Types";
import {Breadcrumb} from "antd";
import React from "react";
import {Link} from "react-router-dom";
import {LocationLink} from "../../Components/Location/LocationLink";

type BreadCrumbsProps = { item: Location };

export function BreadCrumbs({item}: BreadCrumbsProps) {
    return <Breadcrumb style={{margin: '16px 0'}}>
        <Breadcrumb.Item><Link to={"/"}>Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to={"/locations"}>Locations</Link></Breadcrumb.Item>
        {[...item.allParents].reverse().map(p =>
            <><Breadcrumb.Item separator={"/"} key={p.id}><LocationLink to={p}/></Breadcrumb.Item></>)}
        <Breadcrumb.Item>{item.name}</Breadcrumb.Item>
    </Breadcrumb>;
}
