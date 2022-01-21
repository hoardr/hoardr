import {Location} from "../../Api/Types";
import React from "react";
import {Button, Card, ConfigProvider, Empty, message} from "antd";
import {ModalFormBtn} from "../../Components/ModalCard";
import {PlusOutlined} from "@ant-design/icons";
import {TreeTable} from "../../Components/TreeTable";
import {DeleteLocation, locationColumns, RemoveChildLocation} from "./LocationTableActions";
import {LocationForm} from "../../Components/Location/LocationForm";
import {useApi} from "../../Api";

export type LocationTableActions = (category: Location) => React.ReactNode
type LocationsCardProps = { locations: Location[], onUpdate: () => void, actions?: LocationTableActions };

export function LocationsCard({locations, onUpdate}: LocationsCardProps) {
    const api = useApi()
    const addLocationBtn = <ModalFormBtn
        title={"Add location"}
        button={(openModal) => <Button type={"primary"} size={"small"} icon={<PlusOutlined/>}
                                       onClick={openModal}>Add location</Button>}>
        {(form, openModal, closeModal) =>
            <LocationForm form={form}
                          onFinish={values => {
                              api.location.add(values.name, values.parent ? +values.parent : undefined).then(() => {
                                  onUpdate()
                                  message.success(`Added location ${values.name}`)
                                  closeModal()
                              })
                          }}/>}
    </ModalFormBtn>;
    return <Card bordered={false} title={"Locations"}
                 extra={addLocationBtn}>
        <ConfigProvider renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No locations"}/>}>
            <TreeTable data={locations} columns={locationColumns(location => <>
                <DeleteLocation location={location} onUpdate={onUpdate}/>
            </>)} tree={true}/>
        </ConfigProvider>
    </Card>
}

type ChildLocationsCardProps = { children: Location[], onUpdate: () => void, parent: Location, actions?: LocationTableActions };

export function ChildLocationsCard({children, onUpdate, parent}: ChildLocationsCardProps) {
    const api = useApi()
    return <Card bordered={false} title={"Child locations"}
                 extra={<ModalFormBtn
                     title={"Add child location"}
                     button={(openModal) => <Button type={"primary"} size={"small"} icon={<PlusOutlined/>}
                                                    onClick={openModal}>Add child location</Button>}>
                     {(form, openModal, closeModal) =>
                         <LocationForm form={form}
                                       initialValues={{parent}}
                                       onFinish={values => {
                                           api.location.add(values.name, values.parent ? +values.parent : undefined).then(() => {
                                               onUpdate()
                                               message.success(`Added child location ${values.name}`)
                                               closeModal()
                                           })
                                       }}/>}
                 </ModalFormBtn>}>
        <ConfigProvider
            renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No child locations"}/>}>
            <TreeTable data={children}
                       columns={locationColumns(location => <>
                           <RemoveChildLocation parent={parent} child={location} onUpdate={onUpdate}/>
                           <DeleteLocation location={location} onUpdate={onUpdate}/>
                       </>)}/>
        </ConfigProvider>
    </Card>
}

