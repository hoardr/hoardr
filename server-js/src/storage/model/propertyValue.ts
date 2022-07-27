import {AllowNull, BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Property} from "./index";
import Item from "./item";

@Table
export default class PropertyValue extends Model {
    @AllowNull(false)
    @Column
    declare value: string;

    @ForeignKey(() => Property)
    @AllowNull(false)
    @Column
    declare propertyId: number;

    @BelongsTo(() => Property)
    declare property: Property;

    @ForeignKey(() => Item)
    @AllowNull(false)
    @Column
    declare itemId: number;

    @BelongsTo(() => Item)
    declare item: Item;

    static resolver = {
        PropertyValue: {
            property: (parent: PropertyValue) => parent.$get('property'),
            item: (parent: PropertyValue) => parent.$get('item'),
        }
    }
}
