import {Category, CategoryProperty, Item, Location, Property, sequelize, StockItem, Unit} from "../storage/model";
import {Model} from "sequelize-typescript";

export type PropertyTemplate = {
    name: string
    type: string
}

export type LocationTemplate = {
    id?: string
    name: string
    description?: string
    children?: LocationTemplate[]
}

export type StockItemTemplate = {
    quantity: number
    location: string
    item: string
}

export type ItemTemplate = {
    id?: string
    name: string
    description?: string
    category: string
    unit: string
}

export type CategoryTemplate = {
    id?: string
    name: string
    description?: string
    children?: CategoryTemplate[]
    properties?: string[]
}

export type UnitTemplate = {
    id?: string
    name: string
    plural: string
}

export type Template = {
    categories?: CategoryTemplate[]
    properties?: PropertyTemplate[]
    locations?: LocationTemplate[]
    items?: ItemTemplate[]
    stock?: StockItemTemplate[]
    units?: UnitTemplate[]
}
type Identifiable = {id?: string, name: string}
type Tree<T extends Tree<T>> = { children?: T[] };
type Flattened<T> = { [key: string]: T & { children?: string[] | undefined } };

function flatten<T extends Tree<T> & Identifiable>(templates?: T[]): Flattened<T> {
    if (!templates) return {}
    let refMap: Flattened<T> = {}
    templates.forEach(t => {
        refMap = {
            ...refMap,
            [t.id ?? t.name]: {...t, children: t.children?.map(c => c.id ?? c.name)},
        }
        const flattened = flatten(t.children)
        const rKeys = Object.keys(refMap)
        const duplicateKeys = Object.keys(flattened).filter(k => rKeys.includes(k))
        if (duplicateKeys.length > 0) {
            throw new Error(`Duplicate ids/names found: ${duplicateKeys}`)
        }
        refMap = {...refMap, ...flattened}
    })
    return refMap
}

async function createFromTrees<T extends Tree<T> & Identifiable, V extends Model>(templates: T[] | undefined, creator: (template: T) => Promise<V>): Promise<[Flattened<T>, Record<string, V>]> {
    if (!templates) {
        return [{}, {}]
    }
    const flattened = flatten(templates)
    const created: { [k: string]: V } = {}
    for (const [key, value] of Object.entries(flattened)) {
        created[key] = await creator(value)
    }
    for (const [key, value] of Object.entries(flattened)) {
        if (value.children !== undefined && value.children.length > 0) {
            for (const child of value.children) {
                await created[key].$add('child', created[child])
            }
        }
    }
    return [flattened, created]
}

async function createFromIdentifiables<T extends Identifiable, V>(templates: T[] | undefined, creator: (template: T) => Promise<V>): Promise<Record<string, V>> {
    if (!templates) return {}
    const created: {[k: string]: V} = {}
    for (const template of templates) {
        created[template.id ?? template.name] = await creator(template)
    }
    return created
}
async function createFromList<T, V>(templates: T[] | undefined, creator: (template: T) => Promise<V>): Promise<V[]> {
    if (!templates) return []
    const created: V[] = []
    for (const template of templates) {
        created.push(await creator(template))
    }
    return created
}

export async function applyTemplate(template: Template) {
    await sequelize.transaction(async () => {
        const properties = await createFromIdentifiables(template.properties, t => Property.create({
            name: t.name,
            type: t.type
        }))
        const [flatCategories, createdCategories] = await createFromTrees(template.categories, t => Category.create({
            name: t.name,
            description: t.description,
        }))
        for (const [k, category] of Object.entries(flatCategories)) {
            if (!category.properties) continue
            for (const prop of category.properties) {
                await CategoryProperty.create({
                    categoryId: createdCategories[k].id,
                    propertyId: properties[prop].id
                })
            }
        }
        const units = await createFromIdentifiables(template.units, async t => (await Unit.findOrCreate({
            where: {singular: t.name, plural: t.plural},
        }))[0])

        const items = await createFromIdentifiables(template.items, t => Item.create({
            name: t.name,
            categoryId: createdCategories[t.category].id,
            description: t.description,
            unitId: units[t.unit].id
        }))

        const [flatLocations, createdLocations] = await createFromTrees(template.locations, t => Location.create({
            name: t.name,
            description: t.description,
        }))

        const stockItems = await createFromList(template.stock, t => StockItem.create({
            quantity: t.quantity,
            itemId: items[t.item].id,
            locationId: createdLocations[t.location].id,
        }))
    })
}
