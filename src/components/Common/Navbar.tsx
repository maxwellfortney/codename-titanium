import { ChevronDownIcon, QrcodeIcon } from "@heroicons/react/outline";
import CopyToClipboard from "react-copy-to-clipboard";
import { cutMiddleAndAddEllipsis } from "../../utils/strings";
import { toast } from "react-hot-toast";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import useAccountMetas from "../../hooks/useAccountMetas";
import useActiveAccountIndex from "../../hooks/useActiveAccountIndex";
import AccountSelectorModal from "../../modals/AccountSelector";
import { useState } from "react";

export default function Navbar() {
    const [showAccountSelect, setShowAccountSelect] = useState(false);

    const { accountMetas } = useAccountMetas();
    const { activeAccountIndex } = useActiveAccountIndex();

    const activeAccount = accountMetas[activeAccountIndex];

    const settingsHomeMatch = useMatch("/settings");
    const settingsChildpath = useMatch("/settings/*");

    const showBackButton = settingsChildpath && !settingsHomeMatch;

    const navigate = useNavigate();

    function getLeftIcon() {
        if (showBackButton) {
            return (
                <button
                    onClick={() => {
                        navigate(-1);
                    }}
                    className="border-transparent border hover:border-white transition-colors duration-200 rounded-full bg-secondary w-[30px] h-[30px] flex items-center justify-center"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                </button>
            );
        }

        return (
            <button className="transition-colors duration-200 hover:text-primary-text text-secondary-text">
                <QrcodeIcon className="w-5 h-5" />
            </button>
        );
    }

    return (
        <>
            <AccountSelectorModal
                show={showAccountSelect}
                onClose={() => {
                    setShowAccountSelect(false);
                }}
            />
            <div className="flex w-full items-center h-[50px] min-h-[50px] border-b border-primary-border justify-between px-3">
                {getLeftIcon()}
                <div className="flex items-center">
                    <h1 className="mr-2 font-semibold">{activeAccount.name}</h1>

                    <CopyToClipboard
                        text={activeAccount.publicKey}
                        onCopy={() => {
                            toast.success("Copied to clipboard");
                        }}
                    >
                        <button className="flex items-center px-2 py-1 transition-colors duration-200 rounded-lg hover:bg-opacity-75 bg-secondary text-secondary-text">
                            <p className="mr-2 text-sm font-medium tracking-tighter">
                                {cutMiddleAndAddEllipsis(activeAccount.publicKey)}
                            </p>

                            <span className="rounded-full bg-error w-2.5 h-2.5" />
                        </button>
                    </CopyToClipboard>
                </div>

                <button
                    onClick={() => setShowAccountSelect(true)}
                    className="transition-colors duration-200 hover:text-primary-text text-secondary-text"
                >
                    <ChevronDownIcon className="w-5 h-5" />
                </button>
            </div>
        </>
    );
}
