import {Category, Property} from "../../Api/Types";
import React, {useCallback} from "react";
import {Button, Card, ConfigProvider, Empty, message, Popconfirm, Space, Table} from "antd";
import {ColumnsType} from "antd/lib/table";
import {ModalFormBtn} from "../../Components/ModalCard";
import {gql} from "graphql-request";
import {useGraphQLClient} from "../../App";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {BiUnlink} from "react-icons/bi";
import {PropertyForm} from "../../Components/Property/PropertyForm";
import {CategoryLink} from "../../Components/Category/CategoryLink";

const ADD_PROPERTY = gql`mutation($input: AddPropertyInput!) {
    addProperty(input: $input) {
        id name type
    }
}`
const REMOVE_CATEGORY_PROPERTY = gql`mutation($input: RemoveCategoryPropertyInput!) {
    removeCategoryProperty(input: $input) {
        id
    }
}`

export function CategoryPropertiesTable({category, onUpdate}: { category: Category, onUpdate?: () => void }) {
    const allProps = [...category.properties.map(f => {
        return {...f, category}
    }), ...category.allParents.flatMap(p => p.properties.map(f => {
        return {...f, category: p}
    }))]

    const columns: ColumnsType<Property & { category: Category }> = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Type",
            dataIndex: "type"
        },
        {
            title: "Source",
            dataIndex: "category",
            render: (value) => <CategoryLink to={value}/>
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, prop) => <Space>
                <RemovePropertyFromCategoryButton property={prop} category={prop.category} onUpdate={onUpdate}/>
            </Space>
        }
    ]

    return <Table bordered={false} size={"small"} dataSource={allProps} columns={columns} rowKey={"id"}/>;
}

export function RemovePropertyFromCategoryButton({
    property,
    category,
    onUpdate
}: { property: Property, category: Category, onUpdate?: () => void }) {
    const client = useGraphQLClient()
    const removeCategoryProperty = useCallback(async () => {
        await client.request(REMOVE_CATEGORY_PROPERTY, {input: {categoryId: category.id, propertyId: property.id}})
        onUpdate && onUpdate()
    }, [client, category.id, onUpdate, property.id])
    return <Popconfirm title={`Remove property from ${property.category.name}?`}
                       icon={<ExclamationCircleOutlined style={{color: "red"}}/>}
                       onConfirm={async () => await removeCategoryProperty()}>
        <Button style={{color: 'red'}} size={"small"} icon={<BiUnlink size={20}/>} type={"text"}/>
    </Popconfirm>
}

function NewPropertyButton({category, onUpdate}: { category: Category, onUpdate?: () => void }) {
    const client = useGraphQLClient()
    const addProperty = useCallback(async (categoryId: number, name: string, type: string) => {
        await client.request<{ addProperty: Property }>(ADD_PROPERTY, {input: {categoryId, name, type}})
        onUpdate && onUpdate()
    }, [client, onUpdate]);
    return <ModalFormBtn
        title={"New property"}
        button={(openModal) => <Button type={"primary"} size={"small"} icon={<PlusOutlined/>}
                                       onClick={openModal}>New property</Button>}>
        {(form, openModal, closeModal) =>
            <PropertyForm form={form}
                          onFinish={values => {
                              addProperty(category.id, values.name, values.type).then(() => {
                                  message.success(`Added property ${values.name}`)
                                  closeModal()
                              })
                          }}/>}
    </ModalFormBtn>;
}

export function CategoryPropertiesCard({
    category,
    onUpdate
}: { category: Category, onUpdate?: () => void }) {
    return <Card bordered={false} title={"Properties"}
                 extra={<NewPropertyButton category={category} onUpdate={onUpdate}/>}>
        <ConfigProvider renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No properties"}/>}>
            <CategoryPropertiesTable category={category} onUpdate={onUpdate}/>
        </ConfigProvider>
    </Card>
}
