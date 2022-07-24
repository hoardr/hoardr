import {Resolver, sequelize} from "./index";

function transactional<T>(fn: Resolver<T>): Resolver<T> {
    return async (...params) => await sequelize.transaction(async () => {
        return await fn(...params)
    })
}

export {transactional};