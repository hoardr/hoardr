import {Op} from "sequelize";
import {MutationInput, Resolver, Resolvers} from "./index";
import {AllowNull, BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import StockItem from "./stockItem";
import Category from "./category";
import PropertyValue from "./propertyValue";
import AuditLog from "./auditLog";
import {transactional} from "../utils";
import Unit from "./unit";
import {Context} from "../../index";

@Table
export default class Item extends Model {
    @AllowNull(false)
    @Column
    declare name: string;

    @Column
    declare description: string;

    @ForeignKey(() => Unit)
    @AllowNull(false)
    @Column
    declare unitId: number;

    @BelongsTo(() => Unit)
    declare unit: Unit;

    @ForeignKey(() => Category)
    @AllowNull(false)
    @Column
    declare categoryId: number;

    @BelongsTo(() => Category)
    declare category: Category;

    @HasMany(() => StockItem)
    declare stockItems: StockItem[];

    @HasMany(() => PropertyValue)
    declare propertyValues: PropertyValue[]

    static add: Resolver<AddItemInput> = transactional(async (parent, {
        input: {
            name,
            description,
            categoryId,
            unitId
        }
    }) => {
        return await Item.create({name, description, categoryId, unitId})
    })

    static query: Resolver<FindItemsInput> = (parent, {id, name}, {dataSources}) => {
        if (id !== undefined) {
            return dataSources.item.get(id)
        }
        return Item.findAll({
            where: {
                ...id ? {id} : {},
                ...name ? {name: {[Op.substring]: name}} : {}
            }
        })
    }
    static queryOne: Resolver<{ id: number }> = async (parent, {id}) => {
        return await Item.findByPk(id)
    }

    static setPropertyValue: Resolver<SetPropertyValueInput> = transactional(async (parent, {
        input: {
            propertyId,
            value,
            itemId
        }
    }) => {
        const item = (await Item.findByPk(itemId))!!
        const existing = await PropertyValue.findOne({
            where: {itemId, propertyId}
        })
        if (existing) {
            const previousValue = existing.value
            if (previousValue === value) {
                return item
            }
            if (!value) {
                await existing.destroy()
            } else {
                existing.value = value
                await existing.save()
            }
            await AuditLog.log('PROPERTY_VALUE_UPDATED', item,
                {propertyId, previousValue, currentValue: value ?? null}
            )
        } else if (value) {
            await PropertyValue.create({
                propertyId, itemId, value
            })
            await AuditLog.log('PROPERTY_VALUE_UPDATED', item,
                {propertyId, previousValue: null, currentValue: value ?? null}
            )

        }
        return await item.reload()
    })

    static resolver: Resolvers = {
        Query: {
            item: Item.queryOne,
            items: Item.query,
        },
        Item: {
            category: (parent: Item) => parent.$get('category'),
            propertyValues: (parent: Item) => parent.$get('propertyValues'),
            stock: (parent: Item) => parent.$get('stockItems'),
            unit: (parent: Item, _: any, {dataSources}: Context) => dataSources.unit.get(parent.unitId),
            auditLog: (parent: Item) => AuditLog.findByEntity(parent),
        },
        Mutation: {
            addItem: Item.add,
            setPropertyValue: Item.setPropertyValue,
        },
    }
}

export type SetPropertyValueInput = MutationInput<{
    propertyId: number
    itemId: number
    value?: string | null
}>

export type AddItemInput = MutationInput<{
    name: string
    description: string
    categoryId: number
    unitId: number
}>

export type FindItemsInput = {
    id?: number
    name?: string
}

