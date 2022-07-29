import {IconText} from "./IconText";
import {Button, SvgIcon} from "./Button";
import {SlideOver} from "./SlideOver";
import React, {ComponentProps, ReactNode, Ref, useRef, useState} from "react";

export type FormButtonProps = Omit<ComponentProps<typeof Button>, 'children' | 'icon'> & {
    title: string
    subTitle?: ReactNode
    children: (params: { formRef: Ref<HTMLFormElement> }) => ReactNode
    icon: SvgIcon
    submit: string
}

export function FormButton({children, icon, title, submit, subTitle, ...props}: FormButtonProps) {
    const formRef = useRef<HTMLFormElement>(null)
    const [open, setOpen] = useState(false)
    return <>
        <SlideOver open={open}
                   onClose={() => setOpen(false)}
                   subTitle={subTitle}
                   title={<IconText icon={icon}>{title}</IconText>}
                   footer={<><Button onClick={() => setOpen(false)}>Cancel</Button>
                       <Button icon={icon} type={"primary"} onClick={() => {
                           formRef.current?.requestSubmit()
                       }}>{submit}</Button></>}
        >
            {children({formRef})}
        </SlideOver>
        <Button icon={icon} className={"ml-1 sm:ml-3"} type={'success'}
                onClick={() => setOpen(true)} {...props}>{title}</Button>

    </>
}
