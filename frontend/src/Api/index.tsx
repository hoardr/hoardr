import {GraphQLClient} from "graphql-request";
import {createContext, useContext} from "react";
import Api from "./Api";

export const ApiContext = createContext<Api>(new Api(new GraphQLClient('http://localhost:8080/graphql')))

export function useApi() {
    return useContext(ApiContext)
}
