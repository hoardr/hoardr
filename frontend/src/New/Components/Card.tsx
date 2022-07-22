import {PropsWithChildren, ReactNode} from "react";
import {classNames} from "../../Util/classNames";

type CardProps = {
    header?: ReactNode,
    className?: string,
    noDivider?: boolean
}
export const Card = ({children, noDivider, className, header}: PropsWithChildren<CardProps>) => {
    return <div
        className={classNames("bg-white overflow-hidden shadow sm:rounded-lg", noDivider || !header ? "" : "divide-y divide-gray-200", className)}>
        {header ? <div className="px-4 py-2 sm:p-4">{header}</div> : null}
        <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
}
