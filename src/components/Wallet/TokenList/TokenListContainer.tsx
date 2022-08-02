import { useCoingecko } from "../../../hooks/useCoingecko";
import { useCoinsAndBalances } from "../../../hooks/useCoinsAndBalances";
import TokenListItem from "./TokenListItem";
import TokenListItemLoading from "./TokenListItemLoading";

export default function TokenListContainer() {
    const [coinsAndBalances, loading] = useCoinsAndBalances();

    console.log({ coinsAndBalances });

    if (!loading) {
        if (coinsAndBalances.length === 0) {
            return <p className="mt-5 font-semibold">No coins</p>;
        }

        return (
            <div className="flex flex-col items-center justify-start w-full px-3 my-3">
                {coinsAndBalances.map((data) => {
                    return <TokenListItem key={data.coin.address} coinAndBalance={data} />;
                })}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start w-full px-3 mt-3">
            <TokenListItemLoading />
            <TokenListItemLoading />
            <TokenListItemLoading />
            <TokenListItemLoading />
            <TokenListItemLoading />
        </div>
    );
}
