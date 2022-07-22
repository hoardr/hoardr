import React, {ReactNode, useEffect, useState} from 'react';
import './App.css';
import {Layout as AntLayout, Menu, Spin} from "antd";
import Categories from "./Pages/Categories";
import {BrowserRouter, Link, Routes, useLocation} from "react-router-dom";
import {Route} from "react-router";
import {CategoryDetailsView} from "./Pages/Categories/CategoryDetailsView";
import {CategoriesView} from "./Pages/Categories/CategoriesView";
import {LocationsView} from "./Pages/Locations/LocationsView";
import Locations from "./Pages/Locations";
import {LocationDetailsView} from "./Pages/Locations/LocationDetailsView";
import {ItemsView} from "./Pages/Items/ItemsView";
import Items from "./Pages/Items";
import {ItemDetailsView} from "./Pages/Items/ItemDetailsView";
import RootStore from "./State/RootStore";
import Api from "./Api/Api";
import {GraphQLClient} from "graphql-request";
import Layout from "./New/Layout";

export const RootStoreContext = React.createContext(new RootStore(new Api(new GraphQLClient('http://localhost:4000/graphql'))))

export function useStore() {
    return React.useContext(RootStoreContext)
}

function RootSidebar() {
    const location = useLocation().pathname.match(/\/\w+/)!!
    return <Menu mode="inline" theme={"dark"} selectedKeys={[location?.[0]]}>
        <Menu.Item key={"/items"}><Link to={"/items"}>Items</Link></Menu.Item>
        <Menu.Item key={"/categories"}><Link to={"/categories"}>Categories</Link></Menu.Item>
        <Menu.Item key={"/locations"}><Link to={"/locations"}>Locations</Link></Menu.Item>
    </Menu>;
}

function App() {
    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    );
}

function Content() {
    const store = useStore()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        store.load().then(() => {
            setLoading(false)
        })
    }, [setLoading])
    if (loading) {
        return <Spin />
    }

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
        {sidebar ? <AntLayout.Sider className={"site-layout-background"} width={250}>
                {sidebar}
        </AntLayout.Sider> : null}
        <AntLayout>
            <AntLayout.Content style={{padding: "0 50px 16px 50px"}}>
                {children}
            </AntLayout.Content>
        </AntLayout>

    </>
}

export default App;
