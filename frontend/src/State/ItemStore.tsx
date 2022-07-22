import {makeAutoObservable} from "mobx";
import {Item as ApiItem} from "../Api/Types";
import {Item} from "../Api/ObservableTypes";
import RootStore from "./RootStore";
import Api from "../Api/Api";
import {types} from "mobx-state-tree";


export default class ItemStore {
    items: Item[] = []
    loading: boolean = false
    private readonly rootStore: RootStore
    private readonly api: Api;

    constructor(rootStore: RootStore, api: Api) {
        makeAutoObservable(this)
        this.items = []
        this.rootStore = rootStore
        this.api = api
    }

    load() {
        this.loading = true
        this.api.item.getAll().then(items => {
            items.forEach(this.loadFromApi)
        })
    }

    loadFromApi(apiItem: ApiItem) {
        let item = this.items.find(i => i.id === apiItem.id)
        if (!item) {
            item = new Item(apiItem)
            this.items.push(item)
        } else {
            item.updateFromApi(apiItem)
        }
    }
}
