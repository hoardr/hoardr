import {DataNode} from "antd/lib/tree";
import React from "react";

export function updateTreeData(list: DataNode[] | undefined, key: React.Key, children: DataNode[] | undefined): DataNode[] | undefined {
    if (!list) return undefined
    return list.map(node => {
        if (node.key === key) {
            return {
                ...node,
                children,
            };
        }
        if (node.children) {
            return {
                ...node,
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
    });
}
