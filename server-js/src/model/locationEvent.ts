import {AllowNull, BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import Location from "./location";

@Table
export default class LocationEvent extends Model {
    @AllowNull(false)
    @Column
    declare type: string;

    @AllowNull(false)
    @Column(DataTypes.JSON)
    declare data: any;

    @ForeignKey(() => Location)
    @AllowNull(false)
    @Column
    declare locationId: number;

    @BelongsTo(() => Location)
    declare location: Location;
}
