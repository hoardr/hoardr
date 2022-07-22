import {MutationInput, Resolver} from "./index";
import {AllowNull, BelongsToMany, Column, Model, Table} from "sequelize-typescript";
import CategoryProperty from "./categoryProperty";
import Category from "./category";

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

    static add: Resolver<AddPropertyInput> = async (parent, {
        input: {categoryId, name, type}
    }) => {
        const property = await Property.create({name, type, categories: []})
        if (categoryId) {
            const category = (await Category.findByPk(categoryId))!!;
            await property.$add('categories', category)
        }
        return property
    }

    static resolver = {
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

