/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, ReactNode } from "react";

type Props = {
    show: boolean;
    onClose?: () => void;
    children: ReactNode;
};

function Modal({ show, onClose = () => {}, children }: Props) {
    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-20 overflow-y-auto" onClose={onClose}>
                <div className="block min-h-screen p-0 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 transition-opacity bg-[#131517cc] bg-opacity-75 backdrop-blur-[10px]" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-[cubic-bezier(0.4, 0, 0.2, 1)] duration-300"
                        enterFrom="opacity-0 -translate-y-4"
                        enterTo="opacity-100 translate-y-0"
                        leave="ease-[cubic-bezier(0.4, 0, 0.2, 1)] duration-300"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 -translate-y-4"
                    >
                        {children}
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default Modal;
