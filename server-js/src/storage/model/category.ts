import {INTEGER, Op} from "sequelize";
import {MutationInput, Resolver} from "./index";
import {AllowNull, BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import Property from "./property";
import CategoryProperty from "./categoryProperty";
import Item from "./item";
import AuditLog from "./auditLog";
import {ancestors, descendants, transactional} from "../utils";

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

    @BelongsToMany(() => Property, () => CategoryProperty)
    declare properties: Property[];

    @HasMany(() => Item)
    declare items: Item[];

    static add: Resolver<AddCategoryInput> = transactional(async (parent, {input: {name, parentId, description}}) => {
        return await Category.create({
            name, description, parentId,
        })
    })

    static query: Resolver<FindCategoriesInput> = async (parent, {id, name, parentId, root}) => {
        return Category.findAll({
            where: {
                ...id ? {id} : {},
                ...name ? {name: {[Op.substring]: name}} : {},
                ...parentId ? {parentId} : {},
                ...root ? {parentId: null} : {}
            }
        })
    }

    static setParent: Resolver<SetCategoryParentInput> = transactional(async (parent, {
        input: {
            categoryId,
            parentId
        }
    }) => {
        const category = (await Category.findByPk(categoryId))!!
        category.parentId = parentId;
        return await category.save()
    })


    static delete: Resolver<DeleteCategoryInput> = transactional(async (parent, {input: {categoryId}}) => {
        await (await Category.findByPk(categoryId))!!.destroy()
        return categoryId
    })

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
            auditLog: (parent: Category) => AuditLog.findByEntity(parent),
            properties: (parent: Category) => parent.$get('properties'),
            parent: (parent: Category) => parent.$get('parent'),
            items: (parent: Category) => parent.$get('items'),
            allItems: () => [],
            ancestors: ancestors,
            descendants: descendants,
        },
        Mutation: {
            addCategory: Category.add,
            setCategoryParent: Category.setParent,
            deleteCategory: Category.delete,
        }
    }
}


export type AddCategoryInput = MutationInput<{
    name: string
    description?: string
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
    id?: number
    name?: string
    parentId?: number
    root?: boolean
}

