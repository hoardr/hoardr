import {ExclamationCircleOutlined} from "@ant-design/icons";
import {Button, Popconfirm, Tooltip} from "antd";
import React, {ReactNode} from "react";


export type ConfirmButtonProps = {
    confirmTitle: ReactNode
    icon: ReactNode
    tooltip: string
    onConfirm: () => Promise<void>
    type: "error" | "warn" | "info"
}

const colors = {error: "red", warn: "red", info: "red"}
const icons = {error: ExclamationCircleOutlined, warn: ExclamationCircleOutlined, info: ExclamationCircleOutlined}

export function TableConfirmButton(props: ConfirmButtonProps) {
    const color = colors[props.type]
    const confirmIcon = icons[props.type]
    return <Popconfirm title={props.confirmTitle}
                    icon={React.createElement(confirmIcon, {style: {color}})}
                    onConfirm={props.onConfirm}>
            <TableActionButton tooltip={props.tooltip} style={{color}} icon={props.icon}/>
        </Popconfirm>
}

export function TableActionButton({
    color,
    tooltip,
    ...props
}: React.ComponentProps<typeof Button> & { tooltip: string }) {
    return <Tooltip title={tooltip}>
        <Button size={"small"} type={"text"} {...props}/>
    </Tooltip>
}
