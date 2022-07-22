import {makeAutoObservable} from "mobx";
import ItemStore from "../State/ItemStore";
import Api from "./Api";
import {Item as ApiItem} from "./Types";

export class Item {
    id: number
    name: string


    constructor(item: ApiItem) {
        makeAutoObservable(this, {
            id: false
        })
        this.id = item.id
        this.name = item.name
    }

    updateFromApi(item: ApiItem) {
        this.name = item.name
    }
}
