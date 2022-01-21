import {Breadcrumb} from "antd";
import {Link} from "react-router-dom";
import React from "react";
import {Item} from "../../Api/Types";

type BreadCrumbsProps = { item: Item };

export function BreadCrumbs({item}: BreadCrumbsProps) {
    return <Breadcrumb style={{margin: '16px 0'}}>
        <Breadcrumb.Item><Link to={"/"}>Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to={"/items"}>Items</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{item.name}</Breadcrumb.Item>
    </Breadcrumb>;
}
