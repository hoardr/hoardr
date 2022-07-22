import {Menu} from "antd";
import {Link, useLocation} from "react-router-dom";
import React from "react";

export function Navbar() {
    const location = useLocation().pathname.match(/\/\w+/)!!
    return <Menu mode={"horizontal"} selectedKeys={[location?.[0]]}>
        <Menu.Item key={"/items"}><Link to={"/items"}>Items</Link></Menu.Item>
        <Menu.Item key={"/categories"}><Link to={"/categories"}>Categories</Link></Menu.Item>
        <Menu.Item key={"/locations"}><Link to={"/locations"}>Locations</Link></Menu.Item>
    </Menu>;
}
