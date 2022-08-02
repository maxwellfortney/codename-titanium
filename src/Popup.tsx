import { RouteObject, useRoutes } from "react-router";
import { Link, useMatch, Navigate, useLocation } from "react-router-dom";
import UnlockPage from "./pages/Unlock";
import WalletHomePage from "./pages/Wallet/WalletHome";
import WalletLayout from "./pages/Wallet/WalletLayout";
import { Toaster } from "react-hot-toast";
import ConnectionProvider from "./hooks/useConnection";
import TokenRegistryProvider from "./hooks/useTokenRegistry";
import CoingeckoProvider from "./hooks/useCoingecko";
import CoinsAndBalancesProvider from "./hooks/useCoinsAndBalances";
import TokenListContainer from "./components/Wallet/TokenList/TokenListContainer";
import SettingsHomePage from "./pages/Settings/SetttingsHome";
import SettingsListContainer from "./components/Settings/SettingsListContainer";
import NetworkPage from "./pages/Settings/Network";
import EditWalletPage from "./pages/Settings/EditWallet";
import ImportWalletPage from "./pages/Settings/ImportWallet/index";
import RecoveryPhrasePage from "./pages/Settings/ImportWallet/RecoveryPhrase";
import PrivateKeyPage from "./pages/Settings/ImportWallet/PrivateKey";
import UnlockProvider, { useUnlockedAccount } from "./hooks/useUnlockedAccount";
import { ReactNode } from "react";
import UnlockComponent from "./components/Unlock";

const routes: RouteObject[] = [
    {
        element: <UnlockPage />,
        children: [{ path: "/", element: <UnlockComponent /> }],
    },
    {
        element: <WalletLayout />,
        children: [
            {
                path: "wallet",
                element: <WalletHomePage />,
                children: [
                    { path: "coins", element: <TokenListContainer /> },
                    { path: "collectibles", element: <TokenListContainer /> },
                ],
            },
        ],
    },
    {
        element: <WalletLayout />,
        children: [
            {
                path: "settings",
                element: <SettingsHomePage />,
                children: [
                    { index: true, element: <SettingsListContainer /> },
                    { path: "network", element: <NetworkPage /> },
                    { path: "edit-wallet", element: <EditWalletPage /> },
                    {
                        path: "import-wallet",
                        element: <SettingsHomePage />,
                        children: [
                            { index: true, element: <ImportWalletPage /> },
                            { path: "recovery-phrase", element: <RecoveryPhrasePage /> },
                            { path: "private-key", element: <PrivateKeyPage /> },
                        ],
                    },
                ],
            },
        ],
    },
];

export default function Popup() {
    const [unlockedAccountMeta] = useUnlockedAccount();
    const element = useRoutes(routes);

    const homeMatch = useMatch("/");

    const location = useLocation();

    if (!homeMatch && unlockedAccountMeta === undefined) {
        return <Navigate to={`/?callbackUrl=${location.pathname}`} />;
    }

    return element;
}

export function PopupWrapper({ children }: { children: ReactNode }) {
    return (
        <UnlockProvider>
            <TokenRegistryProvider>
                <CoingeckoProvider>
                    <ConnectionProvider>
                        <CoinsAndBalancesProvider>
                            <Toaster
                                position="bottom-center"
                                reverseOrder={false}
                                toastOptions={{
                                    success: {
                                        iconTheme: {
                                            primary: "white",
                                            secondary: "#07A460",
                                        },
                                        style: {
                                            background: "#07A460",
                                            color: "white",
                                            fontSize: "15px",
                                        },
                                    },
                                    error: {
                                        iconTheme: {
                                            primary: "white",
                                            secondary: "#F5424F",
                                        },
                                        style: {
                                            background: "#F5424F",
                                            color: "white",
                                            fontSize: "15px",
                                        },
                                    },
                                }}
                            />
                            {children}
                        </CoinsAndBalancesProvider>
                    </ConnectionProvider>
                </CoingeckoProvider>
            </TokenRegistryProvider>
        </UnlockProvider>
    );
}
