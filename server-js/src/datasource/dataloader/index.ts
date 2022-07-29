import {DataSource} from "apollo-datasource";
import DataLoader from "dataloader";
import {Op} from "sequelize";
import Unit from "../../storage/model/unit";
import {Item} from "../../storage/model";


export class ItemDataSource extends DataSource {
    private loader = new DataLoader<number, Item>(async (ids) => {
        const items = await Item.findAll({where: {id: {[Op.in]: ids}}})
        return ids.map(id => items.find(i => i.id === id) ?? new Error("Not found"))
    })

    async get(id: number): Promise<Item> {
        return await this.loader.load(id)
    }
}

export class UnitDataSource extends DataSource {
    private loader = new DataLoader<number, Unit>(async (ids) => {
        const items = await Unit.findAll({where: {id: {[Op.in]: ids}}})
        return ids.map(id => items.find(i => i.id === id) ?? new Error("Not found"))
    })

    async get(id: number): Promise<Unit> {
        return await this.loader.load(id)
    }
}
