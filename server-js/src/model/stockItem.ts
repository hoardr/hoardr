import {MutationInput, Resolver} from "./index";
import {AllowNull, BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import Item from "./item";
import Location from "./location";

@Table
export default class StockItem extends Model {
    @AllowNull(false)
    @Column
    declare quantity: number;

    @ForeignKey(() => Item)
    @AllowNull(false)
    @Column
    declare itemId: number;

    @BelongsTo(() => Item)
    declare item: Item;

    @ForeignKey(() => Location)
    @AllowNull(false)
    @Column
    declare locationId: number;

    @BelongsTo(() => Location)
    declare location: Location;

    static add: Resolver<AddStockItemInput> = async (parent, {input: {itemId, locationId, quantity}}) => {
        return await StockItem.create({
            itemId, locationId, quantity
        }, {include: ['item', 'location']})
    }

    static find: Resolver<FindStockItemsInput> = (parent, {locationId, itemId}) => {
        return StockItem.findAll({
            where: {
                ...itemId ? {itemId} : {},
                ...locationId ? {locationId} : {},
            }
        })
    }

    static resolver = {
        Query: {
            stockItems: StockItem.find
        },
        Mutation: {
            addStockItem: StockItem.add
        },
        StockItem: {
            location: (parent: StockItem) => parent.$get('location'),
            item: (parent: StockItem) => parent.$get('item'),
        }
    }
}

export type AddStockItemInput = MutationInput<{
    itemId: number,
    locationId: number,
    quantity: number
}>

export type FindStockItemsInput = {
    locationId: number | null,
    itemId: number | null
};


