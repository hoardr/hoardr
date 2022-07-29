import {FolderIcon, ViewGridIcon, ViewListIcon} from '@heroicons/react/outline';
import {PlusIcon} from "@heroicons/react/solid";
import {Route, Routes, useParams} from "react-router-dom";
import {Category, Property} from "../../../Api/Types";
import React, {useEffect, useState} from "react";
import {Tab, Tabs} from "../../Components/Tabs";
import {Card} from "../../Components/Card";
import {Button} from "../../Components/Button";
import {CategoriesTable} from "./CategoriesTable";
import {useApi} from "../../../Api";
import {PageContent} from "../../Layout";
import {ItemsTable} from "./ItemsTable";
import {AuditLogTable} from "./AuditLog";
import {PropertiesTable} from "./PropertiesTable";
import {collectFromAncestors, collectFromDescendants} from "../../util";
import {PageHeading} from "../../Components/PageHeading";
import {NewCategoryForm} from "../../Components/NewCategoryForm";
import {FormButton} from "../../Components/FormButton";
import {NewItemForm} from "../../Components/NewItemForm";

export function Categories() {
    return <Routes>
        <Route path={":id/*"} element={<DetailView/>}/>
        <Route index element={<IndexView/>}/>
    </Routes>
}

function IndexView() {
    const api = useApi()
    const [categories, setCategories] = useState<Category[]>()
    useEffect(() => {
        api.category.getRoot().then(setCategories)
    }, [setCategories, api.category])
    if (!categories) return null;
    return <PageContent>
        <article className="py-2 px-1 md:px-4 h-full max-h-full">
            <PageHeading title={"Categories"}
                         meta={"All top-level categories"}
                         extra={<HeadingButtons/>}/>
            <div className={"my-4 shadow rounded overflow-hidden"}>
                <CategoriesTable categories={categories}/>
            </div>
        </article>
    </PageContent>
}

function HeadingButtons() {
    return <div className="mt-5 flex lg:mt-0 lg:ml-4">
        <FormButton title={"New category"} submit={"Add"} icon={PlusIcon} subTitle={"Add a new category"}>
            {({formRef}) => <NewCategoryForm formRef={formRef}/>}
        </FormButton>
    </div>;
}

function CategoryCard({category}: { category: Category }) {
    const properties: Property[] = collectFromAncestors(category, 'properties', 'category')
    return <article className={"py-2 h-full max-h-full text-sm font-normal"}>
        <Card header={<Card.Title title={category.name} subTitle={category.description}/>}>
            <div className={"-mx-6 -my-6"}>
                <PropertiesTable properties={properties}/>
            </div>
        </Card>
    </article>
}

function DetailView() {
    const api = useApi()
    const {id} = useParams()
    const [category, setCategory] = useState<Category>()
    useEffect(() => {
        api.category.get(Number(id)).then(setCategory)
    }, [id, setCategory, api.category])
    if (!category) return null;
    const tabs: Tab[] = [{
        name: "Subcategories",
        icon: FolderIcon,
        href: `/categories/${category.id}`,
        aside: <FormButton title={"New subcategory"} submit={"Add"} icon={PlusIcon} subTitle={"Add a new category"}>
            {({formRef}) => <NewCategoryForm defaultParentId={category.id} formRef={formRef}/>}
        </FormButton>
    }, {
        name: "Items",
        icon: ViewGridIcon,
        href: `/categories/${category.id}/items`,
        aside: <FormButton title={"New item"} submit={"Add"} icon={PlusIcon} subTitle={"Add a new item"}>
            {({formRef}) => <NewItemForm formRef={formRef} defaultCategoryId={category.id}/>}
        </FormButton>
    }, {
        name: "Log",
        icon: ViewListIcon,
        href: `/categories/${category.id}/log`,
    }]
    return <PageContent sidebar={<CategoryCard category={category}/>}>
        <article className="py-2 h-full max-h-full">
            <Card header={<Tabs tabs={tabs} className={"-mx-4 my-0 md:-my-4"}/>} noDivider>
                <section className={"-mx-6 -my-6"}>
                    <Routes>
                        <Route path={"items"}
                               element={<ItemsTable items={collectFromDescendants(category, 'items', 'category')}/>}/>
                        <Route path={"log"} element={<AuditLogTable events={category.auditLog}/>}/>
                        <Route index element={<CategoriesTable categories={category.children}/>}/>
                    </Routes>
                </section>
            </Card>
        </article>
    </PageContent>
}
