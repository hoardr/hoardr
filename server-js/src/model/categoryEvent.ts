import {AllowNull, BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import Category from "./category";

@Table
export default class CategoryEvent extends Model {
    @AllowNull(false)
    @Column
    declare type: string;

    @AllowNull(false)
    @Column(DataTypes.JSON)
    declare data: any;

    @ForeignKey(() => Category)
    @AllowNull(false)
    @Column
    declare categoryId: number;

    @BelongsTo(() => Category)
    declare category: Category;
}
