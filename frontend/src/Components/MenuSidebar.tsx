import {observer} from "mobx-react-lite";
import React, {useState} from "react";
import {Input, Menu} from "antd";
import {HomeFilled, SearchOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

export type MenuSidebarItem = { key: string, linkTo: string, name: string }

type MenuSidebarProps = { items: MenuSidebarItem[], selectedKey?: string, indexLinkTo: string };
export const MenuSidebar = observer(({items, selectedKey, indexLinkTo}: MenuSidebarProps) => {
    const [query, setQuery] = useState("")
    const filtered = query.length > 0 ? items.filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) : items
    return <>
        <Menu mode="inline" selectedKeys={selectedKey ? [selectedKey] : ["index"]}>
            <Menu.Item key={"search"}>
                <Input type={"search"} prefix={<SearchOutlined/>} onChange={e => {
                    setQuery(e.target.value)
                }}/>
            </Menu.Item>
            <Menu.Item key={"index"} icon={<HomeFilled/>}><Link to={indexLinkTo}>Index</Link></Menu.Item>
            {filtered.map(c => <Menu.Item key={c.key}><Link to={c.linkTo}>{c.name}</Link></Menu.Item>)}
        </Menu>
    </>
});
