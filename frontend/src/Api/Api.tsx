import {gql, GraphQLClient} from "graphql-request";
import {RequestDocument, Variables} from "graphql-request/dist/types";

export default class Api {
    private readonly client: GraphQLClient
    public readonly location: LocationApi
    public readonly category: CategoryApi
    public readonly item: ItemApi

    constructor(client: GraphQLClient) {
        this.client = client
        this.location = new LocationApi(client)
        this.category = new CategoryApi(client)
        this.item = new ItemApi(client)
    }

    public async request<T = any, V = Variables>(document: RequestDocument, variables?: V): Promise<T> {
        return await this.client.request<T, V>(document, variables)
    }
}


export class LocationApi {
    private client: GraphQLClient

    private static DELETE = gql`mutation($input: DeleteLocationInput!) {
        deleteLocation(input: $input)
    }`

    private static SET_PARENT = gql`mutation($input: SetLocationParentInput!) {
        setLocationParent(input: $input) { id }
    }`

    private static ADD = gql`mutation($input: AddLocationInput!) {
        addLocation(input: $input) { id }
    }`

    constructor(client: GraphQLClient) {
        this.client = client
    }

    public async delete(locationId: number) {
        await this.client.request(LocationApi.DELETE, {input: {locationId}})
    }

    public async setParent(locationId: number, parentId?: number) {
        await this.client.request(LocationApi.SET_PARENT, {input: {locationId, parentId}})
    }

    public async add(name: string, parentId?: number) {
        await this.client.request(LocationApi.ADD, {input: {name, parentId}})
    }
}

export class CategoryApi {
    private client: GraphQLClient

    private static DELETE = gql`mutation($input: DeleteCategoryInput!) {
        deleteCategory(input: $input)
    }`

    private static SET_PARENT = gql`mutation($input: SetCategoryParentInput!) {
        setCategoryParent(input: $input) {
            id
        }
    }`

    private static ADD = gql`mutation($input: AddCategoryInput!) {
        addCategory(input: $input) { id }
    }`

    constructor(client: GraphQLClient) {
        this.client = client
    }

    public async delete(categoryId: number) {
        await this.client.request(CategoryApi.DELETE, {input: {categoryId}})
    }

    public async setParent(categoryId: number, parentId?: number) {
        await this.client.request(CategoryApi.SET_PARENT, {input: {categoryId, parentId}})
    }

    public async add(name: string, parentId?: number) {
        await this.client.request(CategoryApi.ADD, {input: {name, parentId}})
    }
}

export class ItemApi {
    private client: GraphQLClient

    constructor(client: GraphQLClient) {
        this.client = client
    }

    private static ADD = gql`mutation($input: AddItemInput!) {
        addItem(input: $input) { id }
    }`

    public async add(name: string, categoryId: number, locationId: number, quantity: number = 1) {
        await this.client.request(ItemApi.ADD, {input: {name, categoryId, locationId, quantity}})
    }
}
