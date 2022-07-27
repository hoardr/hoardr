import {AllowNull, Column, Model, Table} from "sequelize-typescript";

@Table
export default class Unit extends Model {
    @AllowNull(false)
    @Column
    declare singular: string;

    @AllowNull(false)
    @Column
    declare plural: string;
}
