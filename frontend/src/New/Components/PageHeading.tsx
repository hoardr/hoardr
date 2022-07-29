import {ReactNode} from "react";

export type PageHeadingProps = {
    title: string,
    meta: ReactNode,
    extra?: ReactNode
}

export function PageHeading({title, meta, extra}: PageHeadingProps) {
    return <div className="lg:flex lg:items-center lg:justify-between mt-2 mb-4">
        <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-10 text-gray-900 sm:text-3xl">{title}</h2>
            <div
                className="mt-3 sm:flex-wrap sm:mt-0 sm:space-x-6 items-center text-sm text-gray-500">
                {meta}
            </div>
        </div>
        {extra}
    </div>
}
