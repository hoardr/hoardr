import {Table} from "antd";
import React from "react";
import {ColumnsType} from "antd/lib/table";

export type TreeNode<T> = T & { id: number, children?: TreeNode<T>[], parent?: TreeNode<T> }

export function toTree<T>(categories: readonly TreeNode<T>[] | undefined, allCategories: readonly TreeNode<T>[]): TreeNode<T>[] | undefined {
    if (!categories || categories.length === 0) return undefined
    return categories.map(c => {
        const category = allCategories.find(a => a.id === c.id)!!;
        return {...category, children: toTree(category.children, allCategories) as TreeNode<T>[]}
    })
}

export type TreeTableProps<T> = {
    data: readonly TreeNode<T>[]
    tree?: boolean
    columns: ColumnsType<TreeNode<T>>
}

function getRootCategories<T>(categories: readonly TreeNode<T>[]): TreeNode<T>[] {
    return categories.filter(c => !c.parent)
}

export function TreeTable<T>({data, tree, columns}: TreeTableProps<T>) {
    const dataSource = tree ? toTree(getRootCategories(data), data) : data
    return <Table bordered={false}
                  size={"small"}
                  dataSource={dataSource}
                  columns={columns}
                  rowKey={"id"}
                  expandable={{childrenColumnName: tree ? "children" : "___"}}
    />
}
