import {Sequelize} from "sequelize-typescript";
import Category from "./category";
import Property from "./property";
import Item from "./item";
import Location from "./location";
import StockItem from "./stockItem";
import CategoryProperty from "./categoryProperty";
import {IFieldResolver} from "@graphql-tools/utils/typings/Interfaces";
import PropertyValue from "./propertyValue";
import cls from 'cls-hooked';
import AuditLog from "./auditLog";
import Unit from "./unit";

export const namespace = cls.createNamespace('hoardr');
Sequelize.useCLS(namespace);

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'data.db',
    logging: process.env.DEBUG === 'true',
    logQueryParameters: process.env.DEBUG === 'true'
});
const models = [Category, Property, Item, Location, StockItem, CategoryProperty, PropertyValue, AuditLog, Unit,];
sequelize.addModels(models)

models.forEach(m => {
    // @ts-ignore
    m.addHook('afterCreate', AuditLog.logHook('CREATED'))
    // @ts-ignore
    m.addHook('afterUpdate', AuditLog.logHook('UPDATED'))
    // @ts-ignore
    m.addHook('afterDestroy', AuditLog.logHook('DELETED'))
})

export type MutationInput<T> = { input: T }
export type Resolver<T> = IFieldResolver<any, any, T>

export {
    Category, Property, Item, Location, StockItem, CategoryProperty, PropertyValue, AuditLog, Unit,
};

// @ts-ignore
export const resolvers = models.map(m => m.resolver);
export type Resolvers = { [p in string]: { [p in string]: Resolver<any> } }
