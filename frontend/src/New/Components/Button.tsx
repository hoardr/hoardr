import {classNames} from "../../Util/classNames";
import {ComponentProps, FC, PropsWithChildren} from "react";

export type SvgIcon = FC<ComponentProps<'svg'>>
export type ButtonType = 'default' | 'primary'
export type ButtonProps = PropsWithChildren<{
    type?: ButtonType,
    icon?: SvgIcon,
    className?: string
}>

type ButtonTypeStyle = {
    button?: string,
    icon?: string
}

const styles: Record<ButtonType, ButtonTypeStyle> = {
    default: {
        button: 'bg-white hover:bg-gray-50 text-gray-700',
        icon: 'text-gray-500'
    },
    primary: {
        button: 'bg-green-600 hover:bg-green-700 text-white',
        icon: 'text-white'
    }
}

export function Button({children, icon: Icon, type, className}: ButtonProps) {
    const style = styles[type ?? 'default']
    return <button
        type="button"
        className={classNames("inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500", style.button, className)}
    >
        {Icon ? <Icon className={classNames("sm:-ml-1 sm:mr-2 h-5 w-5", style.icon)} aria-hidden="true"/> : null}
        <span className={classNames(Icon ? "hidden sm:block" : "")}>{children}</span>
    </button>;
}
