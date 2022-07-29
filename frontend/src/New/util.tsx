import {Unit} from "../Api/Types";

export function collectFromAncestors<T extends { [key in K]: R[] }, K extends keyof T, R extends { [key in U]: T }, U extends keyof R>(tree: T & { ancestors: T[] }, key: K, targetKey: U): R[] {
    const result: (R & { [key in U]: T })[] = tree[key].map(el => ({...el, [targetKey]: tree}))
    tree.ancestors.filter(a => a[key]).forEach(ancestor => {
        result.push(...ancestor[key].map(el => ({...el, [targetKey]: ancestor})))
    })
    return result
}

export function collectFromDescendants<T extends { [key in K]: R[] }, K extends keyof T, R extends { [key in U]: T }, U extends keyof R>(tree: T & { descendants: T[] }, key: K, targetKey: U): R[] {
    const result: (R & { [key in U]: T })[] = tree[key].map(el => ({...el, [targetKey]: tree}))
    tree.descendants.filter(a => a[key]).forEach(descendant => {
        result.push(...descendant[key].map(el => ({...el, [targetKey]: descendant})))
    })
    return result
}

export function ancestorPath<T extends { name: string, ancestors: T[] }>(elem: T) {
    const elems = [...elem.ancestors.map(l => l.name).reverse(), elem.name]
    return elems.join("/")
}

export function quantity(quantity: number, singular: string, plural: string) {
    return `${quantity} ${quantity === 1 ? singular : plural}`
}
