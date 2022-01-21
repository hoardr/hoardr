import {DateTime} from "luxon";
import {Tooltip} from "antd";
import React from "react";

export function RelativeDateTime({dateTime}: { dateTime: string }) {
    const time = DateTime.fromISO(dateTime)
    return <Tooltip overlay={dateTime}>{time.toRelative()}</Tooltip>
}
