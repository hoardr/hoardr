import React, {ReactNode} from 'react';
import './App.css';
import {Layout} from "antd";
import Categories from "./Pages/Categories";
import {BrowserRouter, Routes} from "react-router-dom";
import {Route} from "react-router";
import {GraphQLClient} from 'graphql-request'
import {CategoryDetailsView} from "./Pages/Categories/CategoryDetailsView";
import {Navbar} from "./Components/Navbar";
import {CategoriesView} from "./Pages/Categories/CategoriesView";
import {LocationsView} from "./Pages/Locations/LocationsView";
import Locations from "./Pages/Locations";
import {LocationDetailsView} from "./Pages/Locations/LocationDetailsView";
import {ItemsView} from "./Pages/Items/ItemsView";
import Items from "./Pages/Items";
import {ItemDetailsView} from "./Pages/Items/ItemDetailsView";

const graphQlClient = new GraphQLClient('http://localhost:8080/graphql')

export const ClientContext = React.createContext(graphQlClient);

export function useGraphQLClient() {
    return React.useContext(ClientContext)
}

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Layout.Header>
                    <Navbar/>
                </Layout.Header>
                <Layout>
                    <ClientContext.Provider value={graphQlClient}>
                        <Content/>
                    </ClientContext.Provider>
                </Layout>
            </Layout>
        </BrowserRouter>
    );
}

function Content() {
    return <Routes>
        <Route path={"categories"} element={<Categories/>}>
            <Route path={":id"} element={<CategoryDetailsView/>}/>
            <Route index element={<CategoriesView/>}/>
        </Route>
        <Route path={"locations"} element={<Locations/>}>
            <Route path={":id"} element={<LocationDetailsView/>}/>
            <Route index element={<LocationsView/>}/>
        </Route>
        <Route path={"items"} element={<Items/>}>
            <Route path={":id"} element={<ItemDetailsView/>}/>
            <Route index element={<ItemsView/>}/>
        </Route>
    </Routes>
}

type PageContentProps = { sidebar?: ReactNode, children: ReactNode };

export function PageContent({sidebar, children}: PageContentProps) {
    return <>
        {sidebar ? <Layout.Sider className={"site-layout-background"}>
            {sidebar}
        </Layout.Sider> : null}
        <Layout.Content style={{padding: "0 50px 16px 50px"}}>
            {children}
        </Layout.Content>
    </>
}

export default App;
