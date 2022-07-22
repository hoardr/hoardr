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
        createdAt: DateTime
        updatedAt: DateTime
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
        parent: Category
        children: [Category!]!
        properties: [Property!]!
        events: [CategoryEvent!]!
        items: [Item!]!
        createdAt: DateTime!
        updatedAt: DateTime!
        allItems: [Item!]!
        allParents: [Category!]!
    }

    type CategoryEvent {
        id: Int!
        type: String!
        data: JSON!
        category: Category!
        createdAt: DateTime!
    }

    type Location {
        id: Int!
        name: String!
        parent: Location
        children: [Location!]!
        events: [LocationEvent!]!
        createdAt: DateTime
        updatedAt: DateTime
        stockItems: [StockItem!]!
        allStockItems: [StockItem!]!
        allParents: [Location!]!
    }

    type LocationEvent {
        id: Int!
        type: String!
        data: JSON!
        location: Location!
        createdAt: DateTime
    }

    type Item {
        id: Int!
        name: String
        category: Category!
        propertyValues: [PropertyValue!]!
        allCategories: [Category!]!
        allProperties: [ItemProperty!]!
        events: [ItemEvent!]!
        createdAt: DateTime
        updatedAt: DateTime
    }

    type ItemEvent {
        id: Int!
        type: String!
        data: JSON!
        item: Item!
        createdAt: DateTime
    }

    type StockItem {
        id: Int!
        quantity: Int!
        location: Location!
        item: Item!
    }

    type Query {
        category(id: Int!): Category
        categories(id: Int, name: String): [Category!]!
        
        item(id: Int!): Item
        items(id: Int, name: String, categoryId: Int): [Item!]!
        
        location(id: Int!): Location
        locations(id: Int, name: String): [Location!]!
        
        property(id: Int!): Property
        properties(id: Int, name: String): [Property!]!
        
        stockItems(locationId: Int, itemId: Int): [StockItem!]!
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
    }

    input SetPropertyValueInput {
        itemId: Int!
        propertyId: Int!
        value: String!
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
        itemId: Int!,
        locationId: Int!,
        quantity: Int!
    }

    type Mutation {
        addCategory(input: AddCategoryInput!): Category!
        setCategoryParent(input: SetCategoryParentInput!): Category!
        deleteCategory(input: DeleteCategoryInput!): Int!

        addProperty(input: AddPropertyInput!): Property!
        setPropertyValue(input: SetPropertyValueInput!): Item!

        addCategoryProperty(input: AddCategoryPropertyInput!): Category!
        removeCategoryProperty(input: RemoveCategoryPropertyInput!): Category!

        addLocation(input: AddLocationInput!): Location!
        setLocationParent(input: SetLocationParentInput!): Location!
        deleteLocation(input: DeleteLocationInput!): Int!

        addItem(input: AddItemInput!): Item!
        
        addStockItem(input: AddStockItemInput!): StockItem!
    }
`)


