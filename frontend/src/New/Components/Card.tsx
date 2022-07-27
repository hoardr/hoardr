import {PropsWithChildren, ReactNode} from "react";
import {classNames} from "../../Util/classNames";

type CardProps = {
    header?: ReactNode,
    className?: string,
    noDivider?: boolean
}
export const Card = ({children, noDivider, className, header}: PropsWithChildren<CardProps>) => {
    return <div
        className={classNames("border bg-white overflow-hidden shadow sm:rounded-lg", noDivider || !header ? "" : "divide-y divide-gray-200", className)}>
        {header ? <div className="px-4 py-2 sm:p-4">{header}</div> : null}
        <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
}

Card.Title = ({title, subTitle}: {title: string, subTitle?: string}) => {
    return <>
        <h1 className={"text-2xl font-bold leading-10 text-gray-900 sm:text-3xl"}>{title}</h1>
        {subTitle ? <span className={"text-gray-500 text-sm"}>{subTitle}</span> : null}
    </>
}
