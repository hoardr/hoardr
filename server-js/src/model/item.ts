import {Op} from "sequelize";
import {MutationInput, Resolver} from "./index";
import {AllowNull, BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import StockItem from "./stockItem";
import Category from "./category";
import {IFieldResolver} from "@graphql-tools/utils/typings/Interfaces";

@Table
export default class Item extends Model {
    @AllowNull(false)
    @Column
    declare name: string;

    @ForeignKey(() => Category)
    @AllowNull(false)
    @Column
    declare categoryId: number;

    @BelongsTo(() => Category)
    declare category: Category;

    @HasMany(() => StockItem)
    declare stockItems: StockItem[];

    static add: Resolver<AddItemInput> = async (parent, {input: {name, categoryId}}) => {
        return Item.create({name, categoryId})
    }

    static query: Resolver<FindItemsInput> = (parent, {id, name}) => {
        return Item.findAll({
            where: {
                ...id ? {id} : {},
                ...name ? {[Op.substring]: name} : {}
            }
        })
    }
    static queryOne: IFieldResolver<Item, any, { id: number }> = async (parent, {id}) => {
        return await Item.findByPk(id)
    }
    static resolver = {
        Query: {
            item: Item.queryOne,
            items: Item.query,
        },
        Item: {
            category: (parent: Item) => parent.$get('category')
        },
        Mutation: {
            addItem: Item.add
        },
    }
}

export type AddItemInput = MutationInput<{
    name: string,
    categoryId: number
}>

export type FindItemsInput = {
    id?: number,
    name?: string
}
