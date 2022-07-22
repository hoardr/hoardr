import {Form, FormInstance, Modal} from "antd";
import React, {ComponentProps, ReactNode, useCallback, useState} from "react";

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

export function ModalFormButton({button, children, ...rest}: ModalFormBtnProps) {
    const [form] = Form.useForm()
    return <ModalButton button={button} onOk={() => form.submit()} onCancel={() => form.resetFields()} {...rest}>
        {((openModal, closeModal) => children(form, openModal, closeModal))}
    </ModalButton>
}

