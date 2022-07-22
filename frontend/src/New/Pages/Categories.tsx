import {SearchIcon} from '@heroicons/react/outline';
import {PageContent} from '../Layout';
import {InformationCircleIcon, LinkIcon, PencilIcon, PlusIcon} from "@heroicons/react/solid";
import {classNames} from '../../Util/classNames';
import {Link, Route, Routes} from "react-router-dom";
import {Category} from "../../Api/Types";
import {Columns, Table} from "../Components/Table";
import {ComponentProps, FC, PropsWithChildren, ReactNode} from "react";

export function Categories() {
    return <PageContent>
        <Routes>
            <Route path={":id"} element={<DetailView category={category}/>}/>
            <Route index element={<IndexView/>}/>
        </Routes>
    </PageContent>
}

function Sidebar() {
    return <div className="px-2 pt-4 pb-4">
        <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
            </div>
            <input
                type="search"
                name="search"
                id="search"
                className="focus:ring-gray-200 focus:border-gray-200 block w-full pl-10 sm:text-sm border-gray-300 rounded-sm"
                placeholder="Search"
            />
        </div>
    </div>
}

const category: Category & any = {
    id: 1,
    name: 'HDMI Cables',
    description: `Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.`,
    fields: {
        Phone: '(555) 123-4567',
        Email: 'ricardocooper@example.com',
        Title: 'Senior Front-End Developer',
        Team: 'Product Development',
        Location: 'San Francisco',
        Sits: 'Oasis, 4th floor',
        Salary: '$145,000',
        Birthday: 'June 8, 1990',
    },
}
const categories: Category[] = [
    // @ts-ignore
    {id: 1, name: "HDMI Cables", description: "Cables of the HDMI variety"},
    // @ts-ignore
    {id: 2, name: "HDMI Cables", description: "Cables of the HDMI variety"},
    // @ts-ignore
    {id: 3, name: "HDMI Cables", description: "Cables of the HDMI variety"},
    // @ts-ignore
    {id: 4, name: "HDMI Cables", description: "Cables of the HDMI variety"},
    // @ts-ignore
    {id: 5, name: "HDMI Cables", description: "Cables of the HDMI variety"},
    // More people...
]

const tabs = [
    {name: 'Subcategories', href: '#', current: true},
    {name: 'Calendar', href: '#', current: false},
    {name: 'Recognition', href: '#', current: false},
]
const columns: Columns<Category> = [
    {
        key: "Name",
        title: "Name",
        render: (category) => <Link to={`/categories/${category.id}`}
                                    className={"text-blue-700 hover:text-blue-900"}>{category.name}</Link>
    },
    {
        key: "Description",
        title: "Description",
        render: (category) => <span className={"text-gray-500"}>{category.description}</span>
    },
    {
        key: "Edit",
        title: <span className="sr-only">Edit</span>,
        className: "text-right",
        render: (category) => <a href="#" className="text-blue-700 hover:text-blue-900">Edit</a>
    },
]

function IndexView() {
    return <article className="py-2 px-1 md:px-4 h-full max-h-full">
        <PageHeading title={"Categories"}
                     meta={<><MetaInfo icon={InformationCircleIcon}>All top-level categories</MetaInfo></>}
                     extra={<HeadingButtons/>}/>
        <div className={"my-4 shadow rounded overflow-hidden"}>
            <Table keyIndex={"id"} columns={columns} data={categories}/>
        </div>
    </article>
}

function MetaInfo({children, icon: Icon}: PropsWithChildren<{ icon: FC<ComponentProps<'svg'>> }>) {
    return <div className="mt-2 flex items-center text-sm text-gray-500">
        <Icon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true"/>
        {children}
    </div>;
}

export type SvgIcon = FC<ComponentProps<'svg'>>
export type ButtonType = undefined | 'primary'

function HeadingButton({children, icon: Icon, type, className}: PropsWithChildren<{ type?: ButtonType, icon?: SvgIcon, className?: string }>) {
    return <button
                  type="button"
                  className={classNames("inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500", type === 'primary' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white hover:bg-gray-50 text-gray-700', className)}
              >
                {Icon ? <Icon className={classNames("-ml-1 mr-2 h-5 w-5", type === 'primary' ? 'text-white' : 'text-gray-500')} aria-hidden="true"/> : null}
                  {children}
              </button>;
}

function HeadingButtons() {
    return <div className="mt-5 flex lg:mt-0 lg:ml-4">
        <HeadingButton icon={PencilIcon}>Edit</HeadingButton>
        <HeadingButton icon={LinkIcon} className={"ml-1 sm:ml-3"}>View</HeadingButton>
        <HeadingButton icon={PlusIcon} className={"ml-1 sm:ml-3"} type={'primary'}>New subcategory</HeadingButton>
    </div>;
}

export type PageHeadingProps = {
    title: string,
    meta: ReactNode,
    extra?: ReactNode
}

function PageHeading({title, meta, extra}: PageHeadingProps) {
    return <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-10 text-gray-900 sm:text-3xl">{title}</h2>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                {meta}
            </div>
        </div>
        {extra}
    </div>
}

function DetailView({category}: { category: Category }) {
    return <article className="py-2 px-1 md:px-4 h-full max-h-full">
        <PageHeading title={category.name}
                     meta={<><MetaInfo icon={InformationCircleIcon}>{category.description}</MetaInfo></>}/>
        <div className={"my-4 shadow rounded overflow-hidden"}>
            <Table keyIndex={"id"} columns={columns} data={categories}/>
        </div>
    </article>
    // @ts-ignore
    /*return <article className="bg-gray-100 h-full flex flex-col items-center justify-start px-2">
        {/!* Profile header *!/}
        <div>
            <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-end sm:space-x-5">
                    <div
                        className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                        <div className="block mt-6 min-w-0 flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 truncate">{category.name}</h1>
                        </div>
                        <div
                            className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                            <button
                                type="button"
                                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                                <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true"/>
                                <span>Edit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/!*
        <div className="mx-2 max-w-7xl w-full">
            <Card header={"hey"}>

                <p>hello world</p>
                <p>hello world</p>
                <p>hello world</p>
                <p>hello world</p>
            </Card>
        </div>
*!/}

        {/!* Tabs *!/}
        <div className="mt-6 sm:mt-2 2xl:mt-5">
            <div className="border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <a
                                key={tab.name}
                                href={tab.href}
                                className={classNames(
                                    tab.current
                                        ? 'border-pink-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                )}
                                aria-current={tab.current ? 'page' : undefined}
                            >
                                {tab.name}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </div>

        {/!* Description list *!/}
        {/!*<Descriptions />*!/}
        {/!*        <div className="mt-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                {Object.keys(category.fields).map((field) => (
                    <div key={field} className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">{field}</dt>
                         @ts-ignore
                        <dd className="mt-1 text-sm text-gray-900">{category.fields[field]}</dd>
                    </div>
                ))}
                <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd
                        className="mt-1 max-w-prose text-sm text-gray-900 space-y-5"
                        dangerouslySetInnerHTML={{ __html: category.description }}
                    />
                </div>
            </dl>
        </div>*!/}

    </article>*/
}
