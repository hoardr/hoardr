import {DataTypes, Op} from "sequelize";
import {MutationInput, Resolver} from "./index";
import {AllowNull, BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import StockItem from "./stockItem";
import LocationEvent from "./locationEvent";

@Table
export default class Location extends Model {
    @AllowNull(false)
    @Column
    declare name: string;

    @ForeignKey(() => Location)
    @Column(DataTypes.INTEGER)
    declare parentId: number | null;

    @BelongsTo(() => Location)
    declare parent: Location;

    @HasMany(() => Location)
    declare children: Location[];

    @HasMany(() => LocationEvent)
    declare events: LocationEvent[];

    @HasMany(() => StockItem)
    declare stockItems: StockItem[];


    static add: Resolver<AddLocationInput> = (parent, {input: {name, parentId}}) => {
        return Location.create({
            name,
            parentId,
            events: [{type: "CREATED", data: {name, parentId}}],
            children: [],
            stockItems: []
        }, {include: ['events']})
    }
    static setParent: Resolver<SetLocationParentInput> = async (parent, {input: {locationId, parentId}}) => {
        const location = (await Location.findByPk(locationId))!!
        location.parentId = parentId;
        return await location.save()
    }

    static query: Resolver<FindLocationsInput> = async (parent, {id, name}) => {
        return Location.findAll({
            where: {
                ...id ? {id} : {},
                ...name ? {[Op.substring]: name} : {}
            },
        })
    }

    static queryOne: Resolver<{ id: number }> = async (parent, {id}) => {
        return await Location.findByPk(id)
    }

    static delete: Resolver<DeleteLocationInput> = async (parent, {input: {locationId}}) => {
        await (await Location.findByPk(locationId))?.destroy()
        return locationId
    }

    static resolver = {
        Query: {
            location: Location.queryOne,
            locations: Location.query,
        },
        Location: {
            events: (parent: Location) => parent.$get('events'),
            children: (parent: Location) => parent.$get('children'),
            parent: (parent: Location) => parent.$get('parent'),
            stockItems: (parent: Location) => parent.$get('stockItems'),
            allStockItems: () => [] // TODO
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
    id?: number,
    name?: string
}

