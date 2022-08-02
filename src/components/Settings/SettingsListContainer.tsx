import useSelectedCluster from "../../hooks/useSelectedCluster";
import SettingsListItem from "./SettingsListItem";

export interface ISetting {
    label: string;
    slug: string;
    to?: string;
    endText?: string;
    isExternal?: boolean;
    onClick?: Function;
}

export default function SettingsListContainer() {
    const [selectedCluster] = useSelectedCluster();

    const SETTINGS_GROUP_1: ISetting[] = [
        { label: "Network", to: "/settings/network", slug: "network", endText: selectedCluster.label },
        { label: "Edit wallet", to: "/settings/edit-wallet", slug: "edit-wallet" },
        { label: "Security", to: "/settings/security", slug: "security" },
        { label: "Lock wallet", slug: "lock-wallet" },
    ];

    const SETTINGS_GROUP_2: ISetting[] = [
        { label: "Create Wallet", slug: "create-wallet" },
        { label: "Import Wallet", to: "/settings/import-wallet", slug: "import-wallet" },
    ];

    return (
        <div className="flex flex-col items-center justify-start w-full">
            <div className="flex flex-col items-center justify-start w-full py-2 border-b border-primary-border">
                {SETTINGS_GROUP_1.map((setting, i) => {
                    const { label, to, endText, onClick, slug } = setting;

                    return (
                        <SettingsListItem
                            key={label}
                            i={i}
                            slug={slug}
                            label={label}
                            to={to}
                            endText={endText}
                            onClick={onClick}
                        />
                    );
                })}
            </div>
            <div className="flex flex-col items-center justify-start w-full py-2 border-b border-primary-border">
                {SETTINGS_GROUP_2.map((setting, i) => {
                    const { label, to, endText, onClick, slug } = setting;

                    return (
                        <SettingsListItem
                            key={label}
                            i={i}
                            slug={slug}
                            label={label}
                            to={to}
                            endText={endText}
                            onClick={onClick}
                        />
                    );
                })}
            </div>
        </div>
    );
}
