import {Category} from "../../Api/Types";
import {categoryColumns, DeleteCategory, RemoveChildCategory} from "./CategoryTableActions";
import React from "react";
import {Button, Card, ConfigProvider, Empty, message} from "antd";
import {ModalFormButton} from "../../Components/ModalCard";
import {PlusOutlined} from "@ant-design/icons";
import {CategoryForm} from "../../Components/Category/CategoryForm";
import {TreeTable} from "../../Components/TreeTable";
import {useApi} from "../../Api";

type CategoriesCardProps = { categories: Category[], onUpdate: () => void };

export function CategoriesCard({categories, onUpdate}: CategoriesCardProps) {
    const api = useApi()
    return <Card bordered={false} title={"Categories"}
                 extra={<ModalFormButton
                     title={"Add category"}
                     button={(openModal) => <Button type={"primary"} size={"small"} icon={<PlusOutlined/>}
                                                    onClick={openModal}>Add category</Button>}>
                     {(form, openModal, closeModal) =>
                         <CategoryForm form={form}
                                       onFinish={values => {
                                           api.category.add(values.name, "", values.parent ? +values.parent : undefined).then(() => {
                                               onUpdate()
                                               message.success(`Added category ${values.name}`)
                                               closeModal()
                                           })
                                       }}/>}
                 </ModalFormButton>}>
        <ConfigProvider renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No categories"}/>}>
            <TreeTable data={categories} columns={categoryColumns(category => <>
                <DeleteCategory category={category} onUpdate={onUpdate}/>
            </>)} tree={true}/>
        </ConfigProvider>
    </Card>
}

type ChildCategoriesCardProps = { categories: Category[], onUpdate: () => void, parent: Category };

export function ChildCategoriesCard({categories, onUpdate, parent}: ChildCategoriesCardProps) {
    const api = useApi()
    return <Card bordered={false} title={"Child categories"}
                 extra={<ModalFormButton
                     title={"Add child category"}
                     button={(openModal) => <Button type={"primary"} size={"small"} icon={<PlusOutlined/>}
                                                    onClick={openModal}>Add child category</Button>}>
                     {(form, openModal, closeModal) =>
                         <CategoryForm form={form}
                                       initialValues={{parent}}
                                       onFinish={values => {
                                           api.category.add(values.name, "", values.parent ? +values.parent : undefined).then(() => {
                                               onUpdate()
                                               message.success(`Added child category ${values.name}`)
                                               closeModal()
                                           })
                                       }}/>}
                 </ModalFormButton>}>
        <ConfigProvider
            renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No child categories"}/>}>
            <TreeTable data={categories}
                       columns={categoryColumns(category => <>
                           <RemoveChildCategory parent={parent} child={category} onUpdate={onUpdate}/>
                           <DeleteCategory category={category} onUpdate={onUpdate}/>
                       </>)}/>
        </ConfigProvider>
    </Card>
}


