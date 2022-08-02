import { DownloadIcon } from "@heroicons/react/outline";
import { FlagIcon, GlobeAltIcon, LockClosedIcon, PencilIcon, PlusCircleIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import { ISetting } from "./SettingsListContainer";

export default function SettingsListItem({
    i,
    label,
    to,
    isExternal = false,
    onClick,
    endText,
    slug,
}: ISetting & { i: number }) {
    function getIcon() {
        switch (slug) {
            case "network":
                return <GlobeAltIcon className="w-6 h-6 text-[#2e9fd9]" />;
            case "security":
                return <FlagIcon className="w-6 h-6 text-[#47c97e]" />;
            case "lock-wallet":
                return <LockClosedIcon className="w-6 h-6 text-[#cc62d5]" />;
            case "edit-wallet":
                return <PencilIcon className="w-6 h-6 text-[#e6658a]" />;
            case "create-wallet":
                return <PlusCircleIcon className="w-6 h-6 text-[#b596ff]" />;
            case "import-wallet":
                return <DownloadIcon className="w-6 h-6 text-[#ff9641]" />;
            default:
                break;
        }
    }

    if (to) {
        if (isExternal) {
            return (
                <a
                    href={to}
                    target="_blank"
                    rel="noreferrer"
                    className="z-10 flex items-center justify-between w-full px-3 py-2 animate-fade-in"
                >
                    {getIcon()}
                    <p className="font-medium">{label}</p>
                    {endText && <p className="text-secondary-text">{endText}</p>}
                </a>
            );
        } else {
            return (
                <Link
                    to={to}
                    className="animate-fade-in z-10 flex items-center justify-between w-full px-3 py-2 transition-colors duration-[250ms] rounded-md hover:bg-secondary"
                >
                    <div className="flex items-center">
                        {getIcon()}

                        <p className="ml-3 font-medium">{label}</p>
                    </div>
                    {endText && <p className="text-secondary-text">{endText}</p>}
                </Link>
            );
        }
    }

    return (
        <button
            onClick={() => (onClick ? onClick() : undefined)}
            className="z-10 animate-fade-in flex items-center justify-between w-full px-3 py-2 transition-colors duration-[250ms] rounded-md hover:bg-secondary"
        >
            <div className="flex items-center">
                {getIcon()}

                <p className="ml-3 font-medium">{label}</p>
            </div>
            {endText && <p className="text-secondary-text">{endText}</p>}
        </button>
    );
}
