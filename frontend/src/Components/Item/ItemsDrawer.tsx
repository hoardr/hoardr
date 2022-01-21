import {Category, Item, Location} from "../../Api/Types";
import React, {useState} from "react";
import {plural} from "../../Util/Plural";
import {Drawer} from "antd";
import {ItemsTable} from "./ItemsTable";


function itemText(count: number) {
    return plural(count, "item", "items")
}

export function ItemsDrawer({
    allItems,
    items,
    location,
    category
}: { allItems: Item[], items: Item[], category?: Category, location?: Location }) {
    const [visible, setVisible] = useState<boolean>(false)
    return <>
        <a onClick={() => {
            setVisible(true)
        }}>{items.length}/{itemText(allItems.length)}</a>
        <Drawer title={"Items"} placement={"right"} onClose={() => {
            setVisible(false)
        }} visible={visible}>
            <ItemsTable items={allItems} location={location} category={category}/>
        </Drawer>
    </>
}
