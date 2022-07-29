import {MutationInput, Resolver} from "./index";
import {AllowNull, BelongsToMany, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import CategoryProperty from "./categoryProperty";
import Category from "./category";
import {Op} from "sequelize";
import {transactional} from "../utils";

@Table
export default class Property extends Model {
    @AllowNull(false)
    @Column
    declare name: string

    @AllowNull(false)
    @Column
    declare type: string;

    @BelongsToMany(() => Category, () => CategoryProperty)
    declare categories: Category[];

    static add: Resolver<AddPropertyInput> = transactional(async (parent, {
        input: {categoryId, name, type}
    }) => {
        const property = await Property.build({name, type})
        if (categoryId) {
            const category = (await Category.findByPk(categoryId))!!;
            await property.$add('categories', category)
        }
        return await property.save()
    })

    static query: Resolver<FindPropertiesInput> = async (parent, {id, name}) => {
        return Property.findAll({
            where: {
                ...id ? {id} : {},
                ...name ? {name: {[Op.substring]: name}} : {}
            },
        })
    }

    static resolver = {
        Query: {
            properties: Property.query,
        },
        Mutation: {
            addProperty: Property.add
        },
        Property: {
            categories: (parent: Property) => parent.$get('categories')
        }
    }
}

export type AddPropertyInput = MutationInput<{
    name: string,
    type: string,
    categoryId?: number
}>

export type FindPropertiesInput = {
    id?: number,
    name?: string
}

