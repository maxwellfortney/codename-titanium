import { useCoinsAndBalances } from "../../hooks/useCoinsAndBalances";
import { toCurrencyDisplay } from "../../utils/strings";

export default function FiatBalanceDashboard() {
    const [coinsAndBalances, loading] = useCoinsAndBalances();

    function calculatePortfolioValue() {
        let ret = 0;

        coinsAndBalances.forEach((data) => {
            const { coin, tokenAccounts } = data;
            if (!coin.marketData) {
                return;
            }

            const balanceInCrypto =
                tokenAccounts.reduce((sum, current) => sum + Number(current.amount), 0) / Math.pow(10, coin.decimals);

            ret += balanceInCrypto * coin.marketData.currentPrice;
        });

        return ret;
    }

    if (!loading && coinsAndBalances) {
        const sum = calculatePortfolioValue();

        return (
            <div className="flex flex-col items-center justify-start w-full my-5">
                <h1 className="text-4xl font-bold">{toCurrencyDisplay(sum)}</h1>

                <div
                    className={`mt-3 flex items-center px-2 py-1 rounded-lg`}
                    style={{
                        color: 1 > 0 ? "#15e166" : "#e1152d",
                        backgroundColor: 1 > 0 ? "#07a46022" : "#e83b4722",
                    }}
                >
                    <p className="text-sm font-medium tracking-tighter">
                        +6.35% ({toCurrencyDisplay((sum * 6.35) / 100)})
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start w-full my-5">
            <span className="h-[40px] animate-pulse bg-gradient-to-r from-[#93959746] to-[#93959722] w-[150px] rounded-md"></span>

            <span className="mt-3 h-[32px] animate-pulse bg-gradient-to-r from-[#93959746] to-[#93959722] w-[110px] rounded-md"></span>
        </div>
    );
}
