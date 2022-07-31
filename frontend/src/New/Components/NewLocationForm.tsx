import {Select, SelectOption} from "./Form/Select";
import {Ref, useEffect, useState} from "react";
import {Text} from "./Form/Text";
import {useApi} from "../../Api";
import {gql} from "graphql-request";
import {Location} from "../../Api/Types";
import {Form} from "./Form";

export function NewLocationForm({
    formRef,
    defaultParentId
}: { formRef?: Ref<HTMLFormElement>, defaultParentId?: number }) {
    const api = useApi()
    const [locations, setLocations] = useState<SelectOption[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        api.request<{ locations: Location[] }>(gql`query {
            locations { id name }}
        `).then(d => {
            setLocations(d.locations.map(c => ({value: c.id, name: c.name})))
            setLoading(false)
        })
    }, [setLocations, setLoading, api])

    if (loading) return <>Loading</>

    return <Form formRef={formRef} onSubmit={async data => {
        await api.location.add(data.name, data.description, +data.parentId)
        window.location.reload()
    }}>
        <div className="space-y-3 sm:space-y-2">
            <Text name={"name"} label={"Name"}/>
            <Text name={"description"} label={"Description"}/>
            <Select name={"parentId"}
                    defaultValue={defaultParentId ? locations.find(c => c.value === defaultParentId) : undefined}
                    options={locations} optional label={"Parent location"}/>
        </div>
    </Form>
}
