import {SvgIcon} from "./Button";
import {PropsWithChildren} from "react";
import {classNames} from "../../Util/classNames";

export function IconText({icon: Icon, children, className}: PropsWithChildren<{icon?: SvgIcon, className?: string}>) {
    return <span className={"inline-flex items-center"}>
        {Icon ? <Icon className={classNames("h-5 w-5 mr-1", className)} aria-hidden="true"/> : null}
        {children}
    </span>
}
