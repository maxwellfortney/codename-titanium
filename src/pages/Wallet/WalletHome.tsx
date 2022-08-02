import { Outlet } from "react-router-dom";
import FiatBalanceDashboard from "../../components/Wallet/FiatBalanceDashboard";
import TabSelector from "../../components/Wallet/TabSelector";

export default function WalletHomePage() {
    return (
        <div className="flex flex-col items-center justify-start w-full">
            <FiatBalanceDashboard />
            <TabSelector />
            <Outlet />
        </div>
    );
}
