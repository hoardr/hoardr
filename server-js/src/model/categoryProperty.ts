import {AllowNull, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import Category from "./category";
import Property from "./property";
import {MutationInput, Resolver} from "./index";

@Table
export default class CategoryProperty extends Model {
    @ForeignKey(() => Category)
    @AllowNull(false)
    @Column
    declare categoryId: number;

    @ForeignKey(() => Property)
    @AllowNull(false)
    @Column
    declare propertyId: number;

    static add: Resolver<AddCategoryPropertyInput> = async (parent, {
        input: {
            categoryId,
            propertyId
        }
    }) => {
        await CategoryProperty.create({
            categoryId, propertyId
        });
        return await Category.findByPk(categoryId)
    }
    static remove: Resolver<RemoveCategoryPropertyInput> = async (parent, {
        input: {
            categoryId,
            propertyId
        }
    }) => {
        const prop = await CategoryProperty.findOne({where: {categoryId, propertyId}});
        await prop?.destroy()
        return await Category.findByPk(categoryId)
    }

    static resolver = {
        Mutation: {
            addCategoryProperty: CategoryProperty.add,
            removeCategoryProperty: CategoryProperty.remove,
        },
    }
}

type AddCategoryPropertyInput = MutationInput<{
    categoryId: number,
    propertyId: number
}>

type RemoveCategoryPropertyInput = MutationInput<{
    categoryId: number,
    propertyId: number
}>
