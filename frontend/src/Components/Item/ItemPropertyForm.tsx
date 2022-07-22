import {FormProps} from "antd/lib/form/Form";
import {Item, Property, PropertyValueType} from "../../Api/Types";
import {ConfigProvider, Empty, Form, Input} from "antd";
import React, {useCallback} from "react";
import {gql} from "graphql-request";
import {SearchSelect, SelectProps} from "../Form/SearchSelect";
import {useApi} from "../../Api";

export type ItemPropertyFormProps =
    Omit<FormProps, 'initialValues'>
    & { initialValues?: { item?: Item, property?: Property, value?: PropertyValueType } }

export function ItemPropertyForm({form, initialValues, onFinish, ...rest}: ItemPropertyFormProps) {
    return <Form form={form}
                 labelCol={{span: 4}}
                 wrapperCol={{span: 20}}
                 initialValues={{property: initialValues?.property?.id, item: initialValues?.item?.id, value: initialValues?.value}}
                 onFinish={async values => {
                     form?.resetFields()
                     if (onFinish) {
                         onFinish(values)
                     }
                 }}
                 {...rest}
    >
        <Form.Item name={"item"} label={"Item"} rules={[{required: true}]}>
            <ItemSelect initialValue={initialValues?.item}/>
        </Form.Item>
        <Form.Item name={"property"} label={"Property"} rules={[{required: true}]}>
            <PropertySelect initialValue={initialValues?.property}/>
        </Form.Item>
        <Form.Item name={"value"} label={"Value"} rules={[{required: false}]}>
            <Input allowClear={true}/>
        </Form.Item>
    </Form>
}

const FIND_ITEMS_BY_NAME = gql`query($name: String!) {
    items(name: $name) { id name }
}`

export function ItemSelect(props: SelectProps<Item>) {
    const api = useApi()
    const search = useCallback(async (name: string) =>
            (await api.request<{ items: Item[] }>(FIND_ITEMS_BY_NAME, {name})).items,
        [api])
    return <ConfigProvider
        renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No items"}/>}>
        <SearchSelect search={search} {...props}/>
    </ConfigProvider>
}

const FIND_PROPERTIES_BY_NAME = gql`query($name: String!) {
    properties(name: $name) { id name }
}`

export function PropertySelect(props: SelectProps<Property>) {
    const api = useApi()
    const search = useCallback(async (name: string) =>
            (await api.request<{ properties: Property[] }>(FIND_PROPERTIES_BY_NAME, {name})).properties,
        [api])
    return <ConfigProvider
        renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No properties"}/>}>
        <SearchSelect search={search} {...props}/>
    </ConfigProvider>
}
