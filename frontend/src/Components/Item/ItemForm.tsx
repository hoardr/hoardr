import {FormProps} from "antd/lib/form/Form";
import {Category, Location} from "../../Api/Types";
import {Form, Input, InputNumber} from "antd";
import React from "react";
import {LocationSelect} from "../Location/LocationForm";
import {CategorySelect} from "../Category/CategoryForm";

export type ItemFormInitialValues = { initialValues?: { category?: Category, location?: Location } }
export type ItemFormProps = Omit<FormProps, 'initialValues'> & ItemFormInitialValues

export function ItemForm({form, initialValues, onFinish, ...rest}: ItemFormProps) {
    return <Form form={form}
                 labelCol={{span: 4}}
                 wrapperCol={{span: 20}}
                 initialValues={{category: initialValues?.category?.id, location: initialValues?.location?.id}}
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
        <Form.Item name={"quantity"} initialValue={1} label={"Quantity"} rules={[{required: true}]}>
            <InputNumber min={0}/>
        </Form.Item>
        <Form.Item name={"location"} label={"Location"} rules={[{required: true}]}>
            {/* @ts-ignore Form.Item handles the missing properties automatically */}
            <LocationSelect initialValue={initialValues?.location}/>
        </Form.Item>
        <Form.Item name={"category"} label={"Category"} rules={[{required: true}]}>
            {/* @ts-ignore Form.Item handles the missing properties automatically */}
            <CategorySelect initialValue={initialValues?.category}/>
        </Form.Item>
    </Form>
}
