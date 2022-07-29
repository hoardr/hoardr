import {PropsWithChildren, Ref} from "react";

export type FormProps = PropsWithChildren<{
    formRef?: Ref<HTMLFormElement>,
    onSubmit?: (data: any) => void | Promise<void>
}>

export function Form({children, formRef, onSubmit}: FormProps) {
    return <form ref={formRef} onSubmit={async e => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        onSubmit && await onSubmit(Object.fromEntries(new FormData(form).entries()))
    }}>
        <div className="space-y-3 sm:space-y-2">
            {children}
        </div>
    </form>
}
