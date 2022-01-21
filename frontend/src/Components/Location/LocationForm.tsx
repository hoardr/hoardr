import {ConfigProvider, Empty, Form, Input} from "antd";
import React, {useCallback} from "react";
import {FormProps} from "antd/lib/form/Form";
import {Location} from "../../Api/Types";
import {useGraphQLClient} from "../../App";
import {gql} from "graphql-request";
import {SearchSelect, SelectProps} from "../Form/SearchSelect";

const FIND_LOCATIONS_BY_NAME = gql`query($name: String!) {
    locations(name: $name) { id name allParents { id name } }
}`

export function LocationSelect(props: SelectProps<Location>) {
    const client = useGraphQLClient()
    const search = useCallback(async (name: string) => (await client.request<{ locations: Location[] }>(FIND_LOCATIONS_BY_NAME, {name})).locations, [client])
    return <ConfigProvider
        renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No locations"}/>}>
        <SearchSelect search={search} {...props} />
    </ConfigProvider>
}


export type LocationFormProps = FormProps & { initialValues?: { parent?: Location } }

export function LocationForm({form, initialValues, onFinish, ...rest}: LocationFormProps) {
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
            <LocationSelect initialValue={initialValues?.parent}/>
        </Form.Item>
    </Form>
}
