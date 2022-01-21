import {gql} from "graphql-request";
import React, {useCallback} from "react";
import {ConfigProvider, Empty, Form, Input} from "antd";
import {Category} from "../../Api/Types";
import {useGraphQLClient} from "../../App";
import {FormProps} from "antd/lib/form/Form";
import {SearchSelect, SelectProps} from "../Form/SearchSelect";

const FIND_CATEGORY_BY_NAME = gql`query($name: String!) {
    categories(name: $name) { id name allParents { id name } }
}`

export function CategorySelect(props: SelectProps<Category>) {
    const client = useGraphQLClient()
    const search = useCallback(async (name: string) =>
            (await client.request<{ categories: Category[] }>(FIND_CATEGORY_BY_NAME, {name})).categories,
        [client])
    return <ConfigProvider
        renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No categories"}/>}>
        <SearchSelect search={search} {...props}/>
    </ConfigProvider>
}

export type CategoryFormProps = FormProps & { initialValues?: { parent?: Category } }

export function CategoryForm({form, initialValues, onFinish, ...rest}: CategoryFormProps) {
    return <Form form={form}
                 labelCol={{span: 4}}
                 wrapperCol={{span: 20}}
                 initialValues={initialValues?.parent ? {parent: initialValues.parent.id} : undefined}
                 onFinish={async values => {
                     form?.resetFields()
                     if (onFinish) {
                         onFinish(values)
                     }
                 }}
                 {...rest}
    >
        <Form.Item name={"name"} label={"Name"} rules={[{required: true}]}>
            <Input/>
        </Form.Item>
        <Form.Item name={"parent"} label={"Parent"} rules={[{required: false}]}>
            {/* @ts-ignore Form.Item handles the missing properties automatically */}
            <CategorySelect initialValue={initialValues?.parent}/>
        </Form.Item>
    </Form>
}
