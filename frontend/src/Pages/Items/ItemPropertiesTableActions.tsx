import {Item, Property, PropertyValueType} from "../../Api/Types";
import {useApi} from "../../Api";
import React from "react";
import {Button, message, Tooltip} from "antd";
import {EditOutlined} from "@ant-design/icons";
import {ModalFormButton} from "../../Components/ModalCard";
import {ItemPropertyForm} from "../../Components/Item/ItemPropertyForm";

export function SetPropertyValue({
    item,
    property,
    onUpdate,
    currentValue,
}: { item: Item, property: Property, currentValue?: PropertyValueType, onUpdate: () => void }) {
    const api = useApi()
    return <Tooltip title={"Set property value"}>
        <ModalFormButton
            title={"Set property value"}

            button={(openModal) => <Button type={"text"} size={"small"}
                                           icon={<EditOutlined style={{color: "#1890ff"}}/>}
                                           onClick={openModal}/>}>
            {(form, openModal, closeModal) =>
                <ItemPropertyForm form={form}
                                  initialValues={{item, property, value: currentValue}}
                                  onFinish={values => {
                                      api.item.setPropertyValue(+values.item, +values.property, values.value).then(() => {
                                          onUpdate()
                                          message.success(`Updated property ${item.name} value`)
                                          closeModal()
                                      })
                                  }}/>}
        </ModalFormButton>
    </Tooltip>
}
