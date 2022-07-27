import {DataTypes, Op} from "sequelize";
import {AuditLog, MutationInput, Resolver} from "./index";
import {AllowNull, BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import StockItem from "./stockItem";
import {ancestors, descendants, transactional} from "../utils";

@Table
export default class Location extends Model {
    @AllowNull(false)
    @Column
    declare name: string;

    @Column
    declare description: string;

    @ForeignKey(() => Location)
    @Column(DataTypes.INTEGER)
    declare parentId: number | null;

    @BelongsTo(() => Location)
    declare parent: Location;

    @HasMany(() => Location)
    declare children: Location[];

    @HasMany(() => StockItem)
    declare stockItems: StockItem[];


    static add: Resolver<AddLocationInput> = transactional(async (parent, {input}) => {
        return await Location.create(input)
    })

    static setParent: Resolver<SetLocationParentInput> = transactional(async (parent, {
        input: {
            locationId,
            parentId
        }
    }) => {
        const location = (await Location.findByPk(locationId))!!
        location.parentId = parentId;
        return await location.save()
    })

    static query: Resolver<FindLocationsInput> = async (parent, {id, name, parentId, root}) => {
        return Location.findAll({
            where: {
                ...id ? {id} : {},
                ...name ? {[Op.substring]: name} : {},
                ...parentId ? {parentId} : {},
                ...root ? {parentId: null} : {}
            },
        })
    }

    static queryOne: Resolver<{ id: number }> = async (parent, {id}) => {
        return await Location.findByPk(id)
    }

    static delete: Resolver<DeleteLocationInput> = transactional(async (parent, {input: {locationId}}) => {
        await (await Location.findByPk(locationId))?.destroy()
        return locationId
    })

    static resolver = {
        Query: {
            location: Location.queryOne,
            locations: Location.query,
        },
        Location: {
            auditLog: (parent: Location) => AuditLog.find(Location.name, parent.id),
            children: (parent: Location) => parent.$get('children'),
            parent: (parent: Location) => parent.$get('parent'),
            stock: (parent: Location) => parent.$get('stockItems'),
            allStockItems: () => [], // TODO
            ancestors: ancestors,
            descendants: descendants,
        },
        Mutation: {
            addLocation: Location.add,
            setLocationParent: Location.setParent,
            deleteLocation: Location.delete,
        }
    }
}

export type AddLocationInput = MutationInput<{
    name: string,
    parentId?: number
}>

export type SetLocationParentInput = MutationInput<{
    locationId: number,
    parentId: number | null
}>

export type DeleteLocationInput = MutationInput<{
    locationId: number,
}>

export type FindLocationsInput = {
    id?: number
    name?: string
    parentId?: number
    root?: boolean
}

