export type Category = {
    id: number
    name: string
    description: string
    children: Category[]
    allItems: Item[]
    items: Item[]
    allParents: Category[]
    properties: Property[]
    events: CategoryEvent[]
    parent: Category
}

export type Location = {
    id: number
    name: string
    children: Location[]
    allItems: Item[]
    items: Item[]
    allParents: Location[]
    events: LocationEvent[]
    parent: Location
}

export type LocationEvent = {
    id: number
    type: string
    data: { [key: string]: string }
    createdDate: string
}

export type ItemEvent = {
    id: number
    type: string
    data: { [key: string]: string }
    createdDate: string
}

export type Property = {
    id: number
    name: string
    type: string,
    category: Category
    categories: Category[]
}

export type PropertyValueType = string

export type CategoryEvent = {
    id: number
    type: string
    data: { [key: string]: string }
    createdDate: string
}

export type PropertyValue = {
    id: number
    value: PropertyValueType
    property: Property
}

export type ItemProperty = {
    item: Item
    property: Property
    category: Category
}

export type Item = {
    id: number
    name: string
    category: Category
    allProperties: ItemProperty[]
    propertyValues: PropertyValue[]
    events: ItemEvent[]
}

