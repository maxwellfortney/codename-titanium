import { Link, useMatch } from "react-router-dom";

export default function TabSelector() {
    const coinsMatch = useMatch("/wallet/coins");
    const collectiblesMatch = useMatch("/wallet/collectibles");

    return (
        <div className="flex items-center justify-around w-full font-semibold border-b border-primary-border">
            <Link
                to="/wallet/coins"
                className={`flex items-center  transition-all duration-200 justify-center pb-3 border-b-2 px-3 border-transparent ${
                    coinsMatch ? "border-white" : "opacity-60"
                }`}
            >
                <p>Coins</p>
            </Link>
            <Link
                to="/wallet/collectibles"
                className={`flex items-center transition-all duration-200 justify-center pb-3 border-b-2 px-3 border-transparent ${
                    collectiblesMatch ? "border-white" : "opacity-60"
                }`}
            >
                <p>NFTs</p>
            </Link>
        </div>
    );
}
