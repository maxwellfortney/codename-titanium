import { CheckIcon, MinusIcon, XIcon } from "@heroicons/react/solid";
import { PencilIcon } from "@heroicons/react/outline";
import Modal from "../components/Common/Modal";
import useAccountMetas, { EncryptedAccountMeta } from "../hooks/useAccountMetas";
import useActiveAccountIndex from "../hooks/useActiveAccountIndex";
import { cutMiddleAndAddEllipsis } from "../utils/strings";
import { useState } from "react";

export default function AccountSelectorModal({ show, onClose }: { show: boolean; onClose: () => void }) {
    const [allowEdit, setAllowEdit] = useState(false);

    const { accountMetas } = useAccountMetas();

    function handleClose() {
        onClose();
        setAllowEdit(false);
    }

    return (
        <Modal show={show} onClose={handleClose}>
            <div className="flex flex-col w-full bg-primary">
                <div className="flex w-full items-center border-b border-primary-border py-3 px-4 h-[50px] justify-between">
                    <p className="text-base font-semibold">Choose wallet</p>

                    <div className="flex items-center">
                        <button
                            className="transition-colors duration-200 text-secondary-text hover:text-white"
                            onClick={() => {
                                setAllowEdit(!allowEdit);
                            }}
                        >
                            {allowEdit ? <p className="text-sm">Done</p> : <PencilIcon className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleClose}
                            className="ml-2 border-transparent border hover:border-white transition-colors duration-200 rounded-full bg-secondary w-[30px] h-[30px] flex items-center justify-center"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {accountMetas.map((accountMeta, i) => {
                    return (
                        <AccountSelectorItem
                            key={accountMeta.publicKey}
                            accountMeta={accountMeta}
                            i={i}
                            onClose={handleClose}
                            allowEdit={allowEdit}
                        />
                    );
                })}
            </div>
        </Modal>
    );
}

function AccountSelectorItem({
    accountMeta,
    i,
    onClose,
    allowEdit,
}: {
    accountMeta: EncryptedAccountMeta;
    i: number;
    onClose: Function;
    allowEdit: boolean;
}) {
    const { activeAccountIndex, setActiveAccountIndex } = useActiveAccountIndex();

    const isActive = activeAccountIndex === i;

    function handleClick() {
        setActiveAccountIndex(i);
        onClose();
    }

    const rightContent = () => {
        if (allowEdit) {
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className="ml-2 transition-opacity duration-150 text-error hover:opacity-70 animate-fade-in"
                >
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="11" fill="currentColor"></circle>
                        <line
                            x1="8.5"
                            y1="12"
                            x2="15.5"
                            y2="12"
                            stroke="white"
                            stroke-width="3"
                            stroke-linecap="round"
                        ></line>
                    </svg>
                </button>
            );
        }

        if (isActive) {
            return (
                <div className="flex w-[20px] h-[20px] ml-1 items-center justify-center text-success animate-fade-in">
                    <CheckIcon className="w-4 h-4" />
                </div>
            );
        }

        return <span className="flex w-[24px] h-[24px] items-center justify-center"></span>;
    };

    return (
        <button
            disabled={allowEdit}
            onClick={handleClick}
            className={`flex items-center justify-between w-full px-3 py-2 transition-colors duration-200 bg-secondary-bg ${
                allowEdit ? "" : "hover:bg-[#93959726]"
            }`}
        >
            <div className="flex items-center font-semibold">
                <p>{accountMeta.name}</p>
            </div>
            <div className="flex items-center text-secondary-text">
                <p>{cutMiddleAndAddEllipsis(accountMeta.publicKey, 5, 5)}</p>

                {rightContent()}
            </div>
        </button>
    );
}
