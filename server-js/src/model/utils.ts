import {Resolver, sequelize} from "./index";
import {Model} from "sequelize-typescript";

export function transactional<T>(fn: Resolver<T>): Resolver<T> {
    return async (...params) => await sequelize.transaction(async () => {
        return await fn(...params)
    })
}

export async function ancestors<T extends Model & {parent: T}>(element: T): Promise<T[]> {
    const result = []
    let elem: T | null = await element.$get('parent')
    while (elem) {
        result.push(elem)
        elem = await elem.$get('parent')
    }
    return result
}
export async function descendants<T extends Model & {children: T[]}>(element: T): Promise<T[]> {
    const result = []
    let elem: T[] = await element.$get('children') ?? []
    for (const e of elem) {
        result.push(e)
        result.push(...await descendants(e))
    }
    return result
}
