import {INTEGER, Op} from "sequelize";
import {MutationInput, Resolver} from "./index";
import {AllowNull, BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import CategoryEvent from "./categoryEvent";
import Property from "./property";
import CategoryProperty from "./categoryProperty";
import Item from "./item";

@Table
export default class Category extends Model {
    @AllowNull(false)
    @Column
    declare name: string;

    @Column
    declare description: string;

    @ForeignKey(() => Category)
    @Column(INTEGER)
    declare parentId: number | null;

    @BelongsTo(() => Category)
    declare parent: Category | null;

    @HasMany(() => Category)
    declare children: Category[];

    @HasMany(() => CategoryEvent)
    declare events: CategoryEvent[];

    @BelongsToMany(() => Property, () => CategoryProperty)
    declare properties: Property[];

    @HasMany(() => Item)
    declare items: Item[];

    static add: Resolver<AddCategoryInput> = async (parent, {input: {name, parentId}}) => {
        return Category.create({
            name,
            parentId,
            events: [{type: "CREATED", data: {name, parentId}}],
        }, {include: ['events']})
    }

    static query: Resolver<FindCategoriesInput> = async (parent, {id, name}) => {
        return Category.findAll({
            where: {
                ...id ? {id} : {},
                ...name ? {[Op.substring]: name} : {}
            }
        })
    }

    static setParent: Resolver<SetCategoryParentInput> = async (parent, {input: {categoryId, parentId}}) => {
        const category = (await Category.findByPk(categoryId))!!
        category.parentId = parentId;
        return await category.save()
    }


    static delete: Resolver<DeleteCategoryInput> = async (parent, {input: {categoryId}}) => {
        await (await Category.findByPk(categoryId))!!.destroy()
        return categoryId
    }

    static queryOne: Resolver<{ id: number }> = async (parent, {id}) => {
        return await Category.findByPk(id)
    }

    static resolver = {
        Query: {
            category: Category.queryOne,
            categories: Category.query,
        },
        Category: {
            children: (parent: Category) => parent.$get('children'),
            events: (parent: Category) => parent.$get('events'),
            properties: (parent: Category) => parent.$get('properties'),
            parent: (parent: Category) => parent.$get('parent'),
            items: (parent: Category) => parent.$get('items'),
            allItems: () => []
        },
        Mutation: {
            addCategory: Category.add,
            setCategoryParent: Category.setParent,
            deleteCategory: Category.delete,
        }
    }
}


export type AddCategoryInput = MutationInput<{
    name: string,
    parentId?: number
}>

export type SetCategoryParentInput = MutationInput<{
    categoryId: number,
    parentId: number | null
}>

export type DeleteCategoryInput = MutationInput<{
    categoryId: number
}>

export type FindCategoriesInput = {
    id?: number,
    name?: string
}

