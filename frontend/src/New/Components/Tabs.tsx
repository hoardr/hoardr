import {classNames} from "../../Util/classNames";
import {ReactNode} from "react";
import {Link, resolvePath, useLocation} from "react-router-dom";
import {SvgIcon} from "./Button";

export type Tab = {
    name: string
    icon?: SvgIcon
    href: string
    aside?: ReactNode
    exact?: boolean
}

export function Tabs({className, tabs}: { className?: string, tabs: Tab[] }) {
    const location = useLocation().pathname
    let activeIdx = -1
    tabs.forEach((tab, idx) => {
        const resolved = resolvePath(tab.href).pathname
        if (location === resolved || (!tab.exact && location.startsWith(resolved) && location.charAt(resolved.length) === '/')) {
            activeIdx = idx;
        }
    })
    return (
        <div className={className}>
            {/*            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    defaultValue={tabs.find((tab) => tab.current)!!.name}
                >
                    {tabs.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                    ))}
                </select>
            </div>*/}
            <div className="block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-2" aria-label="Tabs">
                        {tabs.map((tab, idx) => (
                            <Link to={tab.href}
                                  key={tab.name}
                                  className={classNames(
                                      activeIdx === idx
                                          ? 'border-indigo-500 text-indigo-600'
                                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                      'flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition'
                                  )}
                            >
                                {tab.icon ? <tab.icon className={classNames("mr-2 h-5 w-5")} aria-hidden="true"/> : null}
                                {tab.name}
                            </Link>
                        ))}
                        {activeIdx !== -1 && tabs[activeIdx].aside ? <div className="flex flex-1 items-center justify-end">
                            {tabs[activeIdx].aside}
                        </div> : null}
                    </nav>
                </div>
            </div>
        </div>
    )
}
