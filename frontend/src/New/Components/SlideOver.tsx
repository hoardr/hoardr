import {Dialog, Transition} from "@headlessui/react";
import {XIcon} from "@heroicons/react/outline";
import {Fragment, ReactNode} from "react";

export type SlideOverProps = {
    open: boolean
    onClose: () => void
    title: ReactNode,
    subTitle?: ReactNode
    children: ReactNode
    footer?: ReactNode
};

export function SlideOver({open, onClose, title, subTitle, children, footer}: SlideOverProps) {
    return (
        <Transition.Root appear={true} show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-40"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-40"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black transition-opacity"></div>
                </Transition.Child>
                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-lg">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl divide-y">
                                        <div className="bg-blue-600 py-6 px-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <Dialog.Title
                                                    className="text-lg font-medium text-white">{title}</Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="rounded-md bg-blue-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                        onClick={onClose}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <XIcon className="h-6 w-6" aria-hidden="true"/>
                                                    </button>
                                                </div>
                                            </div>
                                            {subTitle ? <div className="mt-1">
                                                <p className="text-sm text-indigo-300">
                                                    {subTitle}
                                                </p>
                                            </div> : null}
                                        </div>
                                        <div className="relative flex-1 py-6 px-4 sm:px-6">
                                            {children}
                                        </div>
                                        {footer ? <div className="flex flex-shrink-0 justify-end px-4 py-4 gap-2">
                                            {footer}
                                        </div> : null}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
