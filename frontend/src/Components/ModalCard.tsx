import {Button, Card, Form, FormInstance, Modal} from "antd";
import React, {ComponentProps, ReactNode, useCallback, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {Store} from "antd/lib/form/interface";

export type TableCardProps = {
    newItemTitle?: string,
    cardTitle: string,
    onFinish: (values: any) => Promise<void>,
    children: ReactNode,
    formBody: ReactNode,
    initialValues?: Store
}

export function ModalCard({
    newItemTitle,
    onFinish,
    children,
    cardTitle,
    formBody,
    initialValues
}: TableCardProps) {
    return <>
        <Card bordered={false} title={cardTitle}
              extra={newItemTitle ?
                  <ModalFormButton onFinish={onFinish} title={newItemTitle}
                                   initialValues={initialValues}>{formBody}</ModalFormButton> : null}>
            {children}
        </Card>
    </>
}


export type ModalFormButtonProps = {
    title: string,
    onFinish: (values: any) => Promise<void>,
    children: ReactNode,
    initialValues?: Store,
    button?: (openModal: () => void) => React.ReactNode
}

export type ModalButtonProps = {
    button: (openModal: () => void) => React.ReactNode,
    children: (openModal: () => void, closeModal: () => void) => ReactNode
} & Omit<ComponentProps<typeof Modal>, "children">;

export function ModalButton({button, onOk, onCancel, children, ...rest}: ModalButtonProps) {
    const [visible, setVisible] = useState<boolean>(false)
    const closeModal = useCallback(() => {
        setVisible(false)
    }, [setVisible])
    const openModal = useCallback(() => {
        setVisible(true)
    }, [setVisible])
    return <>
        {button(openModal)}
        <Modal visible={visible}
               onOk={(e) => {
                   closeModal()
                   if (onOk) {
                       onOk(e)
                   }
               }}
               onCancel={(e) => {
                   closeModal()
                   if (onCancel) {
                       onCancel(e)
                   }
               }}
               {...rest}
        >
            {visible ? children(openModal, closeModal) : null}
        </Modal>
    </>
}

export type ModalFormBtnProps = {
    button: (openModal: () => void) => React.ReactNode
    children: (form: FormInstance, openModal: () => void, closeModal: () => void) => ReactNode
} & Omit<ComponentProps<typeof Modal>, "children">

export function ModalFormBtn({button, children, ...rest}: ModalFormBtnProps) {
    const [form] = Form.useForm()
    return <ModalButton button={button} onOk={() => form.submit()} onCancel={() => form.resetFields()} {...rest}>
        {((openModal, closeModal) => children(form, openModal, closeModal))}
    </ModalButton>
}

export function ModalFormButton({
    title,
    onFinish,
    children,
    initialValues,
    button
}: ModalFormButtonProps) {
    const [form] = Form.useForm()
    const [visible, setVisible] = useState<boolean>(false)
    const closeModal = useCallback(() => {
        setVisible(false)
    }, [setVisible])
    const openModal = useCallback(() => {
        setVisible(true)
    }, [setVisible])
    return <>
        {button ? button(openModal) : <Button type={"primary"} size={"small"} icon={<PlusOutlined/>}
                                              onClick={openModal}>{title}</Button>}
        <Modal visible={visible}
               onOk={() => {
                   closeModal();
                   form.submit()
               }}
               onCancel={() => {
                   closeModal();
                   form.resetFields()
               }}
               title={title}>
            <Form form={form}
                  labelCol={{span: 4}}
                  wrapperCol={{span: 20}}
                  initialValues={initialValues}
                  onFinish={async values => {
                      form.resetFields()
                      closeModal()
                      await onFinish(values)
                  }}>
                {children}
            </Form>
        </Modal>
    </>
}

