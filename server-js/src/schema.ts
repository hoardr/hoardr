import {buildSchema} from "graphql";

// language=GraphQL
export default buildSchema(`
    scalar Int
    scalar String
    scalar JSON
    scalar DateTime
    scalar Boolean

    type Property {
        id: Int!
        name: String!
        type: PropertyType!
        auditLog: [AuditLog!]!
        createdAt: DateTime!
        updatedAt: DateTime!
        categories: [Category!]!
    }

    enum PropertyType {
        TEXT, NUMBER
    }

    type PropertyValue {
        id: Int!
        property: Property!
        item: Item!
        value: String!
    }

    type ItemProperty {
        item: Item!
        property: Property!
        category: Category!
    }

    type Category {
        id: Int!
        name: String!
        description: String
        parent: Category
        children: [Category!]!
        properties: [Property!]!
        auditLog: [AuditLog!]!
        items: [Item!]!
        createdAt: DateTime!
        updatedAt: DateTime!
        allItems: [Item!]!
        ancestors: [Category!]!
        descendants: [Category!]!
    }

    type Location {
        id: Int!
        name: String!
        description: String
        parent: Location
        children: [Location!]!
        auditLog: [AuditLog!]!
        createdAt: DateTime!
        updatedAt: DateTime!
        stock: [StockItem!]!
        allStockItems: [StockItem!]!
        ancestors: [Location!]!
        descendants: [Location!]!
    }

    type Item {
        id: Int!
        name: String!
        description: String
        unit: Unit!
        category: Category!
        propertyValues: [PropertyValue!]!
        allCategories: [Category!]!
        allProperties: [ItemProperty!]!
        stock: [StockItem!]!
        auditLog: [AuditLog!]!
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type StockItem {
        id: Int!
        quantity: Int!
        location: Location!
        item: Item!
    }
    
    type Unit {
        id: Int!
        singular: String!
        plural: String!
    }

    type AuditLog {
        id: Int!
        entity: String!
        entityId: Int!
        action: String!
        data: JSON!
        createdAt: DateTime!
    }

    type Query {
        category(id: Int!): Category
        categories(id: Int, name: String, parentId: Int, root: Boolean): [Category!]!

        item(id: Int!): Item
        items(id: Int, name: String, categoryId: Int): [Item!]!

        location(id: Int!): Location
        locations(id: Int, name: String, parentId: Int, root: Boolean): [Location!]!

        property(id: Int!): Property
        properties(id: Int, name: String): [Property!]!

        stockItems(locationId: Int, itemId: Int): [StockItem!]!

        auditLog(entity: String, entityId: String): [AuditLog]!
    }

    input AddLocationInput {
        name: String!
        parentId: Int
    }

    input AddCategoryInput {
        name: String!
        parentId: Int
    }

    input AddPropertyInput {
        name: String!
        type: String!
        categoryId: Int
    }

    input AddCategoryPropertyInput {
        categoryId: Int!
        propertyId: Int!
    }

    input AddItemInput {
        name: String!
        categoryId: Int!
        unitId: Int!
    }

    input SetPropertyValueInput {
        itemId: Int!
        propertyId: Int!
        value: String
    }

    input RemoveCategoryPropertyInput {
        categoryId: Int!
        propertyId: Int!
    }

    input SetCategoryParentInput {
        categoryId: Int!
        parentId: Int
    }

    input SetLocationParentInput {
        locationId: Int!
        parentId: Int
    }

    input DeleteCategoryInput {
        categoryId: Int!
    }

    input DeleteLocationInput {
        locationId: Int!
    }

    input AddStockItemInput {
        itemId: Int!
        locationId: Int!
        quantity: Int!
    }

    type Mutation {
        addCategory(input: AddCategoryInput!): Category!
        setCategoryParent(input: SetCategoryParentInput!): Category!
        deleteCategory(input: DeleteCategoryInput!): Int!

        addProperty(input: AddPropertyInput!): Property!

        addCategoryProperty(input: AddCategoryPropertyInput!): Category!
        removeCategoryProperty(input: RemoveCategoryPropertyInput!): Category!

        addLocation(input: AddLocationInput!): Location!
        setLocationParent(input: SetLocationParentInput!): Location!
        deleteLocation(input: DeleteLocationInput!): Int!

        addItem(input: AddItemInput!): Item!
        setPropertyValue(input: SetPropertyValueInput!): Item!

        addStockItem(input: AddStockItemInput!): StockItem!
    }
`)


