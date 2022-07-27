import {FC, PropsWithChildren, ReactNode, SVGProps} from 'react'
import {Disclosure} from '@headlessui/react'
import {FolderIcon, HomeIcon, LocationMarkerIcon, MenuIcon, ViewGridIcon, XIcon} from '@heroicons/react/outline'
import {NavLink, Route, Routes} from 'react-router-dom'
import {Categories} from '../Pages/Categories'
import {classNames} from "../../Util/classNames";
import {Breadcrumb, Breadcrumbs} from "../Components/Breadcrumbs";
import {Items} from "../Pages/Items";

const navigation = [
    {name: 'Home', href: '/', icon: HomeIcon},
    {name: 'Categories', href: '/categories', icon: FolderIcon},
    {name: 'Locations', href: '/locations', icon: LocationMarkerIcon},
    {name: 'Items', href: '/items', icon: ViewGridIcon},
]

const breadcrumbs = [
    {name: 'Home', href: '/', current: false},
    {name: 'Categories', href: '/categories', current: false},
    {name: 'Electronics', href: '#', current: false},
    {name: 'HDMI Cables', href: '#', current: true},
]

export function PageContent({children, sidebar}: PropsWithChildren<{ sidebar?: ReactNode }>) {
    return <main className={"flex flex-grow gap-2 flex-col lg:flex-row px-0 md:px-2"}>
        {sidebar ? <aside className="lg:w-128">
            {sidebar}
        </aside> : null}
        <section className="overflow-y-auto flex-grow">
            {children}
        </section>
    </main>
}

export type NavbarProps = {
    navigation: { name: string, href: string, icon: FC<SVGProps<SVGSVGElement>> }[]
}

export function Navbar({navigation}: NavbarProps) {
    return <Disclosure as="nav" className="bg-blue-600 shadow-sm">
        {({open}) => (
            <>
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <img
                                    className="block lg:hidden h-8 w-auto"
                                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                    alt="Workflow"
                                />
                                <img
                                    className="hidden lg:block h-8 w-auto"
                                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                                    alt="Workflow"
                                />
                            </div>
                            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-4 sm:items-center">
                                {navigation.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        className={({isActive}) => classNames(
                                            isActive ? 'bg-blue-800' : 'hover:bg-blue-700',
                                            'px-3 py-2 text-sm font-medium rounded-md transition-colors text-white flex'
                                        )}
                                    >
                                        <item.icon className="h-5 w-5 mr-1"/>
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                        <div className="-mr-2 flex items-center sm:hidden">
                            {/* Mobile menu button */}
                            <Disclosure.Button
                                className="bg-blue-900 inline-flex items-center justify-center p-2 rounded-md text-gray-50 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span className="sr-only">Open main menu</span>
                                {open ? (
                                    <XIcon className="block h-6 w-6" aria-hidden="true"/>
                                ) : (
                                    <MenuIcon className="block h-6 w-6" aria-hidden="true"/>
                                )}
                            </Disclosure.Button>
                        </div>
                    </div>
                </div>

                <Disclosure.Panel className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1 text-gray-50">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({isActive}) => classNames(
                                    isActive
                                        ? 'bg-blue-800 border-indigo-500'
                                        : 'border-transparent hover:bg-blue-700 hover:border-gray-300',
                                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                                )}
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                </Disclosure.Panel>
            </>
        )}
    </Disclosure>
}
export type BuildBreadcrumbs = (breadcrumbs: Breadcrumb[]) => void

export default function Layout() {
    return (
        <>
            <header className={"bg-white shadow"}>
                <Navbar navigation={navigation}/>
                <Breadcrumbs items={breadcrumbs}/>
            </header>
            <Routes>
                <Route path={"categories/*"} element={<Categories/>}/>
                <Route path={"items/*"} element={<Items/>}/>
            </Routes>
        </>
    )
}
