import {Item} from "../../Api/Types";
import {Button, Card, ConfigProvider, Empty, message} from "antd";
import {ModalFormBtn} from "../ModalCard";
import {itemColumns} from "./ItemsTable";
import React from "react";
import {useApi} from "../../Api";
import {PlusOutlined} from "@ant-design/icons";
import {TreeTable} from "../TreeTable";
import {ItemForm, ItemFormInitialValues} from "./ItemForm";

// export function ItemsCard({items}: { items: Item[] }) {
//     const formBody = <>
//         <Form.Item name={"name"} label={"Name"} rules={[{required: true}]}>
//             <Input/>
//         </Form.Item>
//         <Form.Item name={"category"} label={"Category"} rules={[{required: true}]}>
//             <CategorySelect />
//         </Form.Item>
//         <Form.Item name={"location"} label={"Location"} rules={[{required: true}]}>
//             <LocationSelect />
//         </Form.Item>
//     </>
//     return <ModalCard
//         cardTitle={"Items"}
//         newItemTitle={"New item"}
//         onFinish={async () => {
//         }}
//         formBody={formBody}>
//         <ItemsTable items={items}/>
//     </ModalCard>
// }
export type ItemsTableActions = (item: Item) => React.ReactNode

type ItemsCardProps = { items: Item[], onUpdate: () => void } & ItemFormInitialValues;


export function ItemsCard({items, onUpdate, initialValues}: ItemsCardProps) {
    const api = useApi()
    return <Card bordered={false} title={"Items"}
                 extra={<ModalFormBtn
                     title={"Add item"}
                     button={(openModal) => <Button type={"primary"} size={"small"} icon={<PlusOutlined/>}
                                                    onClick={openModal}>Add item</Button>}>
                     {(form, openModal, closeModal) =>
                         <ItemForm form={form}
                                   initialValues={initialValues}
                                   onFinish={values => {
                                       api.item.add(values.name, +values.category, +values.location, +values.quantity).then(() => {
                                           onUpdate()
                                           message.success(`Added item ${values.name}`)
                                           closeModal()
                                       })
                                   }}/>}
                 </ModalFormBtn>}>
        <ConfigProvider renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No items"}/>}>
            <TreeTable data={items} columns={itemColumns()}/>
        </ConfigProvider>
    </Card>
}
