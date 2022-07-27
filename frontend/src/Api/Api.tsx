import {gql, GraphQLClient} from "graphql-request";
import {RequestDocument, Variables} from "graphql-request/dist/types";
import {Category, Item, Location} from "./Types";
import {makeAutoObservable} from "mobx";
import {Axios} from "axios";

export default class Api {
    private readonly client: GraphQLClient
    public readonly location: LocationApi
    public readonly category: CategoryApi
    public readonly item: ItemApi

    constructor(client: GraphQLClient) {
        makeAutoObservable(this)
        const axios = new Axios({baseURL: "http://localhost:4000", transformResponse: data => JSON.parse(data)})
        this.client = client
        this.location = new LocationApi(client, axios)
        this.category = new CategoryApi(client, axios)
        this.item = new ItemApi(client)
    }

    public async request<T = any, V = Variables>(document: RequestDocument, variables?: V): Promise<T> {
        return await this.client.request<T, V>(document, variables)
    }
}


export class LocationApi {

    private static DELETE = gql`mutation($input: DeleteLocationInput!) {
        deleteLocation(input: $input)
    }`

    private static SET_PARENT = gql`mutation($input: SetLocationParentInput!) {
        setLocationParent(input: $input) { id }
    }`

    private static ADD = gql`mutation($input: AddLocationInput!) {
        addLocation(input: $input) { id }
    }`

    private static GET = gql`query($id: Int) {
        locations(id: $id) {
            id
            name
            allStockItems { id quantity item { id name category { id name } } }
            children { id name }
            stock { id quantity item { id name } }
            parent { id name }
        }
    }`

    constructor(private client: GraphQLClient, private axios: Axios) {

    }

    public async getAll(): Promise<Location[]> {
        // return (await this.axios.get<Location[]>("/v1/categories")).data
        return (await this.client.request<{ locations: Location[] }>(LocationApi.GET)).locations
    }

    public async get(id: number): Promise<Location[]> {
        return (await this.client.request<{ locations: Location[] }>(LocationApi.GET, {id})).locations
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

    constructor(private client: GraphQLClient, private axios: Axios) {

    }

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

    private static selection(s: string) {
        return gql`
            fragment innerSelection on Category {
                id name description items { id name stock { id quantity location { id name }}} properties { id name type } ancestors { name description }
            }
            fragment selection on Category {
                ...innerSelection
                children { id name description items {id name} }
                #items { id name category { id name ancestors { name } } stock { id quantity location { id name }} }
                auditLog { id createdAt action entity entityId data}
                ancestors { ...innerSelection }
                descendants { ...innerSelection }
                parent { id name }
            }
        ${s}`
    }

    private static GET = CategoryApi.selection(gql`query($id: Int) {
        categories(id: $id) {
            ...selection
        }
    }`)
    private static GET_ONE = CategoryApi.selection(gql`query($id: Int!) {
        category(id: $id) {
            ...selection
        }
    }`)
    private static GET_ROOT = CategoryApi.selection(gql`query {
        categories(root: true) {
            ...selection
        }
    }`)

    public async getAll(): Promise<Category[]> {
        return (await this.client.request<{ categories: Category[] }>(CategoryApi.GET)).categories
    }

    public async getRoot(): Promise<Category[]> {
        return (await this.client.request<{ categories: Category[] }>(CategoryApi.GET_ROOT)).categories
    }

    public async get(id: number): Promise<Category> {
        return (await this.client.request<{ category: Category }>(CategoryApi.GET_ONE, {id})).category
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

    private static SET_PROPERTY_VALUE = gql`mutation($input: SetPropertyValueInput!){
        setPropertyValue(input: $input) { id }
    }`

    private static selection(s: string) {
        return gql`fragment selection on Item {
            id
            name
            description
            category { id name description ancestors { name } }
            auditLog { id createdAt action entity entityId data}
            stock { quantity location { id name description ancestors { name } }}
        }
        ${s}`
    }

    private static GET_ALL_ITEMS = ItemApi.selection(gql`query {
        items {
            ...selection
        }
    }`)

    private static GET_BY_ID = ItemApi.selection(gql`query($id: Int!) {
        item(id: $id) {
            ...selection
        }
    }`)


    public async getAll(): Promise<Item[]> {
        return (await this.client.request<{ items: Item[] }>(ItemApi.GET_ALL_ITEMS)).items
    }

    public async get(id: Number): Promise<Item> {
        return (await this.client.request<{ item: Item }>(ItemApi.GET_BY_ID, {id})).item
    }

    public async add(name: string, categoryId: number, locationId: number, quantity: number = 1) {
        await this.client.request(ItemApi.ADD, {input: {name, categoryId, locationId, quantity}})
    }

    public async setPropertyValue(itemId: number, propertyId: number, value: string | null) {
        await this.client.request(ItemApi.SET_PROPERTY_VALUE, {input: {itemId, propertyId, value}})
    }
}
