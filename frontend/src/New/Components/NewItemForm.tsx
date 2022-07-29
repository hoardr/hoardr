import {Select, SelectOption} from "./Form/Select";
import {Ref, useEffect, useState} from "react";
import {Text} from "./Form/Text";
import {useApi} from "../../Api";
import {gql} from "graphql-request";
import {Category, Unit} from "../../Api/Types";
import {Form} from "./Form";

export function NewItemForm({formRef, defaultCategoryId}: {formRef?: Ref<HTMLFormElement>, defaultCategoryId?: number}) {
    const api = useApi()
    const [categories, setCategories] = useState<SelectOption[]>([])
    const [units, setUnits] = useState<SelectOption[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.request<{categories: Category[], units: Unit[]}>(gql`query {
            categories { id name } units { id singular }}
        `).then(d => {
            setCategories(d.categories.map(c => ({value: c.id, name: c.name})))
            setUnits(d.units.map(u => ({value: u.id, name: u.singular})))
            setLoading(false)
        })
    }, [setCategories, setUnits, setLoading])

    if (loading) return <>Loading</>

    return <Form formRef={formRef} onSubmit={async data => {
        await api.item.add(data.name, data.description, +data.categoryId, +data.unitId)
        window.location.reload()
    }}>
        <div className="space-y-3 sm:space-y-2">
            <Text name={"name"} label={"Name"} />
            <Text name={"description"} label={"Description"} />
            <Select name={"categoryId"} defaultValue={defaultCategoryId ? categories.find(c => c.value === defaultCategoryId) : undefined} options={categories} label={"Category"} />
            <Select name={"unitId"} options={units} label={"Unit"} />
        </div>
    </Form>
}
