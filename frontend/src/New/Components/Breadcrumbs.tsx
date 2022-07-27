import {ArrowNarrowLeftIcon} from "@heroicons/react/solid";
import {Link} from "react-router-dom";
import {HomeIcon} from "@heroicons/react/outline";
import {ReactNode} from "react";

export type Breadcrumb = {
    name: ReactNode,
    href: string,
    current: boolean
}
export type BreadcrumbsProps = {
    items: Breadcrumb[]
}

export function Breadcrumbs({items}: BreadcrumbsProps) {
    if (items.length < 2) return null;
    return <div className="px-4 sm:px-6">
        <div className="border-t border-gray-200 py-3">
            <nav className="flex" aria-label="Breadcrumbs">
                <div className="flex sm:hidden">
                    <a
                        href="src/New/Components/index#"
                        className="group inline-flex space-x-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                        <ArrowNarrowLeftIcon
                            className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-600"
                            aria-hidden="true"
                        />
                        <span>Back to {items[items.length - 2].name}</span>
                    </a>
                </div>
                <div className="hidden sm:block">
                    <ol role="list" className="flex items-center space-x-4">
                        <li>
                            <div>
                                <Link to="/" className="text-gray-400 hover:text-gray-500">
                                    <HomeIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true"/>
                                    <span className="sr-only">Home</span>
                                </Link>
                            </div>
                        </li>
                        {items.slice(1).map((item) => (<li key={typeof item.name === 'string' ? item.name : item.href}>
                            <div className="flex items-center">
                                <svg
                                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                >
                                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z"/>
                                </svg>
                                <Link
                                    to={item.href}
                                    className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Link>
                            </div>
                        </li>))}
                    </ol>
                </div>
            </nav>
        </div>
    </div>;
}
