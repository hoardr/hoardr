import {Sequelize} from "sequelize-typescript";
import Category from "./category";
import Property from "./property";
import Item from "./item";
import Location from "./location";
import StockItem from "./stockItem";
import CategoryProperty from "./categoryProperty";
import LocationEvent from "./locationEvent";
import CategoryEvent from "./categoryEvent";
import {GraphQLResolveInfo} from "graphql/type/definition";
import {FieldNode} from "graphql";
import {IFieldResolver} from "@graphql-tools/utils/typings/Interfaces";

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'data.db',
    logQueryParameters: true
});
const models = [Category, Property, Item, Location, StockItem, CategoryProperty, LocationEvent, CategoryEvent];
sequelize.addModels(models)

export function getSelectedRelations(info: GraphQLResolveInfo, ...required: string[]): string[] {
    const selections = info.fieldNodes[0].selectionSet?.selections ?? [];
    return [...new Set([...required, ...selections.filter(s => s.kind == 'Field' && s.selectionSet !== undefined).map(s => (s as FieldNode).name.value)])]
}

export function getSelectedAttributes(info: GraphQLResolveInfo, ...required: string[]): string[] {
    const selections = info.fieldNodes[0].selectionSet?.selections ?? [];
    return [...new Set([...required, ...selections.filter(s => s.kind == 'Field' && s.selectionSet === undefined).map(s => (s as FieldNode).name.value)])]
}

export type MutationInput<T> = { input: T }
export type Resolver<T> = IFieldResolver<any, any, T>

export {
    Category, Property, Item, Location, StockItem, CategoryProperty, LocationEvent, CategoryEvent,
};

// @ts-ignore
export const resolvers = models.map(m => m.resolver);
