import {AllowNull, Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {namespace, Resolver} from "./index";
import _ from 'lodash';

@Table
export default class AuditLog extends Model {

    @AllowNull(false)
    @Column
    declare entity: string

    @AllowNull(false)
    @Column
    declare entityId: number;

    @AllowNull(false)
    @Column
    declare action: string;

    @AllowNull(false)
    @Column(DataTypes.JSON)
    declare data: any;

    static async find<T extends Model>(entity?: string, entityId?: number) {
        return await AuditLog.findAll({
            where: {...entity ? {entity} : {}, ...entityId ? {entityId} : {}}
        })
    }

    static async findByEntity<T extends Model>(entity?: T) {
        return await AuditLog.find(entity?.constructor?.name, entity?.id)
    }

    static query: Resolver<FindAuditLogInput> = async (parent, {entity, entityId}) => {
        return AuditLog.find(entity, entityId)
    }

    static logHook = _.curry(async <M extends Model>(action: string, model: M, options: any) => {
        return await AuditLog.log(action, model, {
            // @ts-ignore
            previousValues: model._previousDataValues,
            // @ts-ignore
            currentValues: model.dataValues,
        })
    })

    static log = async <M extends Model>(action: string, model: M, data: any) => {
        if (model.constructor.name === 'AuditLog' || model.id === undefined) {
            return
        }
        const transaction = namespace.get('transaction')
        if (!transaction) {
            throw new Error(`Please add a transaction around ${action} for ${model.constructor.name}`)
        }
        return await AuditLog.create({
            entity: model.constructor.name,
            entityId: model.id,
            action,
            data
        });
    }

    static resolver = {
        Query: {
            auditLog: AuditLog.query,
        }
    }
}

export type FindAuditLogInput = {
    entity?: string,
    entityId?: number
}
