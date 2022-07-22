import {makeAutoObservable} from "mobx";
import {flow, IModelType, ModelActions, types} from "mobx-state-tree";
import Api from "../Api/Api";
import {Category as ApiCategory, Item as ApiItem, Location as ApiLocation} from "../Api/Types";
import {
    ModelPropertiesDeclaration,
    ModelPropertiesDeclarationToProperties
} from "mobx-state-tree/dist/types/complex-types/model";

export const PropertyModel = types.model({
    id: types.identifierNumber,
    name: types.string,
    type: types.string
})

// @ts-ignore
export const CategoryModel = types.model({
    id: types.identifierNumber,
    name: types.string,
    parent: types.maybe(types.reference(types.late(() => CategoryModel))),
    children: types.array(types.reference(types.late(() => CategoryModel))),
    properties: types.array(PropertyModel)
}).actions(self => ({
    updateFromApi(category: ApiCategory) {
        self.name = category.name
        self.children.replace(category.children.map(c => c.id))
    }
})).views(self => ({
    get allParents(): (typeof CategoryModel)[] {
        const parents = []
        let p = self.parent
        while (p) {
            parents.push(p)
            p = p.parent
        }
        return parents
    }
}))

// @ts-ignore
export const LocationModel = types.model({
    id: types.identifierNumber,
    name: types.string,
    children: types.array(types.reference(types.late(() => LocationModel)))
}).actions(self => ({
    updateFromApi(location: ApiLocation) {
        self.name = location.name
        self.children.replace(location.children.map(c => c.id))
    }
}))

const AutoLoadedCategory = types.reference(CategoryModel, {
    get(identifier: number) {
        return ""
    },
    set(value) {
        return value.id
    }
})

type LoadingStoreProps<ModelProps extends ModelPropertiesDeclaration, ApiType> = {
    model: IModelType<ModelPropertiesDeclarationToProperties<ModelProps>, ModelActions>,
    loadAll: () => Promise<ApiType[]>
}

function locationStore(api: Api) {
    return types.model({
        locations: types.array(LocationModel),
        loading: false
    }).actions(self => ({
        loadFromApi(apiLocation: ApiLocation) {
            let location = self.locations.find(l => l.id === apiLocation.id)
            if (!location) {
                location = LocationModel.create({
                    id: apiLocation.id,
                    name: apiLocation.name,
                    parent: apiLocation.parent?.id,
                    children: apiLocation.children.map(c => c.id),
                })
                self.locations.push(location)
            } else {
                location.updateFromApi(apiLocation)
            }
            return location
        },
    })).actions(self => ({
        load: flow(function* (id: number) {
            self.loading = true
            const category = self.loadFromApi(yield api.location.get(id))
            self.loading = false
            return category
        }),
        loadAll: flow(function* () {
            self.loading = true
            const all = yield api.location.getAll()
            all.forEach(self.loadFromApi)
            self.loading = false
        })
    }))
        .actions(self => ({
            getOrLoad(id: number) {
                const category = self.locations.find(l => l.id === id)
                if (!category) {
                    self.load(id)
                }
                return category
            },

        })).create({
            locations: []
        })
}

function categoryStore(api: Api) {
    return types.model({
        categories: types.array(CategoryModel),
        loading: false
    }).actions(self => ({
        loadFromApi(apiCategory: ApiCategory) {
            let category = self.categories.find(c => c.id === apiCategory.id)
            if (!category) {
                category = CategoryModel.create({
                    id: apiCategory.id,
                    name: apiCategory.name,
                    parent: apiCategory.parent?.id,
                    children: apiCategory.children.map(c => c.id),
                    properties: apiCategory.properties.map(p => PropertyModel.create({
                        id: p.id,
                        name: p.name,
                        type: p.type
                    }))
                })
                self.categories.push(category)
            } else {
                category.updateFromApi(apiCategory)
            }
            return category
        },
    })).actions(self => ({
        load: flow(function* (id: number) {
            self.loading = true
            const cat = yield api.category.get(id);
            const category = self.loadFromApi(cat)
            self.loading = false
            return category
        }),
        loadAll: flow(function* () {
            self.loading = true
            const all = yield api.category.getAll()
            all.forEach(self.loadFromApi)
            self.loading = false
        })
    }))
        .actions(self => ({
            async getOrLoad(id: number): Promise<typeof CategoryModel> {
                return self.categories.find(c => c.id === id) ?? await self.load(id)
            },

        })).create({
            categories: []
        })
}


// @ts-ignore
export const PropertyValueModel = types.model({
    id: types.identifierNumber,
    value: types.string,
    property: types.reference(types.late(() => ItemPropertyModel))
})

// @ts-ignore
export const ItemPropertyModel = types.model({
    item: types.reference(types.late(() => ItemModel)),
    property: types.reference(PropertyModel),
    category: types.reference(CategoryModel),
    value: types.maybe(types.reference(PropertyValueModel))
})

export const ItemEventModel = types.model({
    id: types.identifierNumber,
    type: types.string,
    data: types.map(types.string),
    createdDate: types.string
})

// @ts-ignore
export const ItemModel = types.model({
    id: types.identifierNumber,
    name: types.string,
    category: types.reference(CategoryModel),
    properties: types.array(ItemPropertyModel),
    events: types.array(ItemEventModel)
}).actions(self => ({
    updateFromApi(item: ApiItem) {
        self.name = item.name
    }
}))

function itemStore(api: Api) {
    return types.model({
        items: types.array(ItemModel),
        loading: false
    }).actions(self => ({
        loadFromApi(apiItem: ApiItem) {
            let item = self.items.find(i => i.id === apiItem.id)
            if (!item) {
                item = ItemModel.create({
                    id: apiItem.id,
                    name: apiItem.name,
                    category: apiItem.category.id,
                    // properties: apiItem.allProperties.map(p => ({
                    //     item: apiItem.id,
                    //     property:
                    // }))
                })
                self.items.push(item)
            } else {
                item.updateFromApi(apiItem)
            }
        }
    })).actions(self => ({
        loadAll: flow(function* () {
            self.loading = true
            const items = yield api.item.getAll()
            items.forEach(self.loadFromApi)
            self.loading = false
        })
    })).create({
        items: []
    })
}


export default class RootStore {
    private api: Api
    itemStore: ReturnType<typeof itemStore>
    categoryStore: ReturnType<typeof categoryStore>
    locationStore: ReturnType<typeof locationStore>


    constructor(api: Api) {
        makeAutoObservable(this)
        this.api = api
        this.itemStore = itemStore(api)
        this.categoryStore = categoryStore(api)
        this.locationStore = locationStore(api)
    }

    async load() {
        await Promise.all([
            this.categoryStore.loadAll(),
            this.itemStore.loadAll(),
            this.locationStore.loadAll()
        ])
    }

    get loading() {
        return this.categoryStore.loading || this.itemStore.loading || this.locationStore.loading
    }
}
