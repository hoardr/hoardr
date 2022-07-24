import {Sequelize} from "sequelize-typescript";
import Category from "./category";
import Property from "./property";
import Item from "./item";
import Location from "./location";
import StockItem from "./stockItem";
import CategoryProperty from "./categoryProperty";
import {GraphQLResolveInfo} from "graphql/type/definition";
import {FieldNode} from "graphql";
import {IFieldResolver} from "@graphql-tools/utils/typings/Interfaces";
import PropertyValue from "./propertyValue";
import cls from 'cls-hooked';
import AuditLog from "./auditLog";

export const namespace = cls.createNamespace('hoardr');
Sequelize.useCLS(namespace);

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'data.db',
    logQueryParameters: true
});
const models = [Category, Property, Item, Location, StockItem, CategoryProperty, PropertyValue, AuditLog,];
sequelize.addModels(models)

models.forEach(m => {
    // @ts-ignore
    m.addHook('afterCreate', AuditLog.logHook('CREATED'))
    // @ts-ignore
    m.addHook('afterUpdate', AuditLog.logHook('UPDATED'))
    // @ts-ignore
    m.addHook('afterDestroy', AuditLog.logHook('DELETED'))
})

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
    Category, Property, Item, Location, StockItem, CategoryProperty, PropertyValue, AuditLog
};

// @ts-ignore
export const resolvers = models.map(m => m.resolver);
