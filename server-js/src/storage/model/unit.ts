import {AllowNull, Column, Model, Table} from "sequelize-typescript";
import {Resolver} from "./index";

@Table
export default class Unit extends Model {
    @AllowNull(false)
    @Column
    declare singular: string;

    @AllowNull(false)
    @Column
    declare plural: string;

    static query: Resolver<FindUnitsInput> = async () => {
        return Unit.findAll({})
    }

    static resolver = {
        Query: {
            units: Unit.query,
        },
    }
}

export type FindUnitsInput = {}
