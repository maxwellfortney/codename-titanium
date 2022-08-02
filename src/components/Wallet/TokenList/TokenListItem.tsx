import randomColor from "randomcolor";
import { Link } from "react-router-dom";
import { CoinAndBalance } from "../../../hooks/useCoinsAndBalances";
import { toCurrencyDisplay } from "../../../utils/strings";

export default function TokenListItem({ coinAndBalance }: { coinAndBalance: CoinAndBalance }) {
    const { coin, tokenAccounts } = coinAndBalance;
    const loadingGradient = "bg-gradient-to-r from-primary-shimmer to-secondary-shimmer";

    const balanceInCrypto =
        tokenAccounts.reduce((sum, current) => sum + Number(current.amount), 0) / Math.pow(10, coin.decimals);

    return (
        <Link
            to={`/tokens/${coin.address}`}
            className="flex items-center w-full py-2 transition-opacity duration-200 animate-fade-in hover:opacity-75"
        >
            {/* <div className={`flex h-[40px] w-[40px] flex-none mr-3 rounded-full animate-pulse ${loadingGradient}`} /> */}

            {coin.metadata.icon ? (
                <img
                    src={coin.metadata.icon}
                    alt={coin.metadata.symbol}
                    className="flex h-[40px] w-[40px] rounded-full mr-3"
                />
            ) : (
                <div
                    className="flex h-[40px] w-[40px] flex-none mr-3 rounded-full items-center justify-center"
                    style={{ backgroundColor: randomColor({ seed: coin.metadata.symbol }) }}
                >
                    <p className="text-xs font-semibold text-white">{coin.metadata.symbol}</p>
                </div>
            )}

            <div className="flex justify-between w-full h-[90%]">
                <div className="flex flex-col items-start justify-between w-full">
                    <p
                        className="w-full text-sm font-semibold text-left break-all truncate"
                        style={{ maxWidth: "calc(100% - 10px)" }}
                    >
                        {coin.metadata.name}
                    </p>
                    <div className="flex rounded-md">
                        <p className="text-xs text-secondary-text">
                            {balanceInCrypto} {coin.metadata.symbol}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                    {coin.marketData && (
                        <p className="text-sm font-semibold">
                            {toCurrencyDisplay(balanceInCrypto * coin.marketData.currentPrice)}
                        </p>
                    )}
                    {coin.marketData && (
                        <p
                            className="text-xs font-medium px-1 rounded-md py-[1px] mt-[1px] leading-tight"
                            style={{
                                color: coin.marketData.priceChangePercentage24H > 0 ? "#15e166" : "#e1152d",
                                backgroundColor:
                                    coin.marketData.priceChangePercentage24H > 0 ? "#07a46022" : "#e83b4722",
                            }}
                        >
                            {coin.marketData.priceChangePercentage24H > 0 && "+"}
                            {coin.marketData.priceChangePercentage24H.toFixed(2)}%
                        </p>
                    )}{" "}
                </div>
            </div>
        </Link>
    );
}
