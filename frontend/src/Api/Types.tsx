export type Category = {
    id: number
    name: string
    description: string
    children: Category[]
    allItems: Item[]
    items: Item[]
    allParents: Category[]
    ancestors: Category[]
    descendants: Category[]
    properties: Property[]
    events: CategoryEvent[]
    parent: Category
    auditLog: AuditLogEvent[]
}

export type Location = {
    id: number
    name: string
    description?: string
    children: Location[]
    allItems: Item[]
    items: Item[]
    allParents: Location[]
    ancestors: Location[]
    descendants: Location[]
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
    createdAt: string
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

export type StockItem = {
    quantity: number
    item: Item
    location: Location
}

export type Item = {
    stock: StockItem[];
    id: number
    description?: string
    name: string
    category: Category
    allProperties: ItemProperty[]
    propertyValues: PropertyValue[]
    events: ItemEvent[]
    auditLog: AuditLogEvent[]
}

export type AuditLogEvent = {
    id: number
    entity: string
    entityId: number
    action: string
    data: any
    createdAt: string
}

