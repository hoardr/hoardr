import express = require("express");
import schema from "./schema";
import {resolvers, sequelize} from "./storage/model";
import {ApolloServer} from "apollo-server-express";
import http from "http";
import {ApolloServerPluginDrainHttpServer} from "apollo-server-core";
import {IExecutableSchemaDefinition} from "@graphql-tools/schema";
import {applyTemplate} from "./template";
import dummyTemplate from "./template/dummy.template";
import {ItemDataSource, UnitDataSource} from "./datasource/dataloader";

const dataSources = () => ({
    item: new ItemDataSource(),
    unit: new UnitDataSource(),
})

export type DataSources = ReturnType<typeof dataSources>
export type Context = { dataSources: DataSources }

async function startServer(typeDefs: IExecutableSchemaDefinition['typeDefs'], resolvers: IExecutableSchemaDefinition['resolvers']) {
    console.log("Syncing migrations")
    await sequelize.sync(); // TODO replace with actual migrations
    console.log("Migrations synced")
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: 'bounded',
        plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
        dataSources
    });
    await server.start();
    server.applyMiddleware({
        app, cors: {
            origin: ["http://localhost:3000", "https://studio.apollographql.com"]
        }
    });
    app.post('/dummyTemplate', (req, res) => {
        applyTemplate(dummyTemplate)
        res.send("OK")
    })
    await new Promise<void>(resolve => httpServer.listen({port: 4000}, resolve));
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer(schema, resolvers).then(() => {})

