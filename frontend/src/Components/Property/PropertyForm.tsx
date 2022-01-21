import {Form, Input} from "antd";
import React from "react";
import {FormProps} from "antd/lib/form/Form";

export type PropertyFormProps = FormProps // & { initialValues?: { parent?: Category } }

export function PropertyForm({form, onFinish, ...rest}: PropertyFormProps) {
    return <Form form={form}
                 labelCol={{span: 4}}
                 wrapperCol={{span: 20}}
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
        <Form.Item name={"type"} label={"Type"} rules={[{required: true}]}>
            <Input/>
        </Form.Item>
    </Form>
}
