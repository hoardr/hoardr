import {Select, SelectOption} from "./Form/Select";
import {Ref, useEffect, useRef, useState} from "react";
import {Text} from "./Form/Text";
import {useApi} from "../../Api";
import {gql} from "graphql-request";
import {Category, Unit} from "../../Api/Types";
import {Form} from "./Form";

export function NewCategoryForm({formRef, defaultParentId}: {formRef?: Ref<HTMLFormElement>, defaultParentId?: number}) {
    const api = useApi()
    const [categories, setCategories] = useState<SelectOption[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        api.request<{categories: Category[]}>(gql`query {
            categories { id name }}
        `).then(d => {
            setCategories(d.categories.map(c => ({value: c.id, name: c.name})))
            setLoading(false)
        })
    }, [setCategories, setLoading])

    if (loading) return <>Loading</>

    return <Form formRef={formRef} onSubmit={async data => {
        await api.category.add(data.name, data.description, +data.parentId)
        window.location.reload()
    }}>
        <div className="space-y-3 sm:space-y-2">
            <Text name={"name"} label={"Name"} />
            <Text name={"description"} label={"Description"} />
            <Select name={"parentId"} defaultValue={defaultParentId ? categories.find(c => c.value === defaultParentId) : undefined} options={categories} optional label={"Parent category"} />
        </div>
    </Form>
}
