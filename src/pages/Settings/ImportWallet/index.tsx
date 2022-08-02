import { Link } from "react-router-dom";

export default function ImportWalletPage() {
    return (
        <div className="flex flex-col items-center justify-start w-full p-4">
            <h1 className="self-start text-xl font-semibold">Import Wallet</h1>
            <p className="self-start mt-1 text-sm text-secondary-text">
                Choose one of the methods below to import your wallet.
            </p>

            <div className="flex flex-col items-center justify-start w-full mt-6 gap-y-3">
                <Link
                    to="recovery-phrase"
                    className="flex flex-col w-full p-4 transition-all duration-200 bg-opacity-50 rounded-lg hover:bg-opacity-80 bg-secondary"
                >
                    <h2 className="font-semibold">Recovery Phrase</h2>
                    <p className="mt-1 text-sm">Import wallets with a 12 or 24 word phrase.</p>
                </Link>
                <Link
                    to="private-key"
                    className="flex flex-col w-full p-4 transition-all duration-200 bg-opacity-50 rounded-lg hover:bg-opacity-80 bg-secondary"
                >
                    <h2 className="font-semibold">Private Key</h2>
                    <p className="mt-1 text-sm">Import Wallet by entering it's private key.</p>
                </Link>
            </div>
        </div>
    );
}
