import {Category} from "../../Api/Types";
import {Breadcrumb} from "antd";
import React from "react";
import {Link} from "react-router-dom";
import {CategoryLink} from "../../Components/Category/CategoryLink";

type BreadCrumbsProps = { category: Category };

export function BreadCrumbs({category}: BreadCrumbsProps) {
    return <Breadcrumb style={{margin: '16px 0'}}>
        <Breadcrumb.Item><Link to={"/"}>Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to={"/categories"}>Categories</Link></Breadcrumb.Item>
        {[...category.allParents].reverse().map(p =>
            <><Breadcrumb.Item separator={"/"} key={p.id}><CategoryLink to={p}/></Breadcrumb.Item></>)}
        <Breadcrumb.Item>{category.name}</Breadcrumb.Item>
    </Breadcrumb>;
}
