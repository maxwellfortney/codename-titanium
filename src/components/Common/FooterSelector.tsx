import { LightningBoltIcon, HomeIcon, CogIcon } from "@heroicons/react/solid";
import { Link, useMatch } from "react-router-dom";

export default function FooterSelector() {
    const walletMatch = useMatch("/wallet/*");
    const activityMatch = useMatch("/activity/*");
    const settingsMatch = useMatch("/settings/*");

    return (
        <div className="flex w-full h-[50px] min-h-[50px] items-center justify-around border-t border-primary-border">
            <Link to="/wallet/coins" className="flex items-center justify-center w-full">
                <HomeIcon
                    className={`w-6 h-6 opacity-50 transition-opacity duration-200 ${
                        walletMatch ? "!opacity-100" : "hover:opacity-75"
                    }`}
                />
            </Link>
            <Link to="/activity" className="flex items-center justify-center w-full">
                <LightningBoltIcon
                    className={`w-6 h-6 opacity-50 transition-opacity duration-200 ${
                        activityMatch ? "!opacity-100" : "hover:opacity-75"
                    }`}
                />
            </Link>
            <Link to="/settings" className="flex items-center justify-center w-full">
                <CogIcon
                    className={`w-6 h-6 opacity-50 transition-opacity duration-200 ${
                        settingsMatch ? "!opacity-100" : "hover:opacity-75"
                    }`}
                />
            </Link>
        </div>
    );
}
