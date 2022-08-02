import { CoinGeckoAPI } from "@coingecko/cg-api-ts";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { CoinMarketData } from "./useCoinsAndBalances";
import { useTokenRegistry } from "./useTokenRegistry";

interface ICoingeckoContext {
    priceMap: Map<string, CoinMarketData> | undefined;
}

export const CoingeckoContext = createContext({} as ICoingeckoContext);

const coingecko = new CoinGeckoAPI(window.fetch.bind(window));

export default function CoingeckoProvider({ children }: { children: ReactNode }) {
    const [priceMap, setPriceMap] = useState<Map<string, CoinMarketData> | undefined>(undefined);
    const tokenRegistry = useTokenRegistry();

    async function fetchMarkets() {
        const marketsRes = await coingecko.getCoinsMarket(
            "usd",
            undefined,
            Array.from(tokenRegistry!)
                .map(([name, value]) => value)
                .filter((x) => x.extensions?.coingeckoId)
                .map((x) => x.extensions?.coingeckoId!)
                .slice(0, 249),
            250,
            undefined,
            undefined,
            ["24hr"] as any
        );

        console.log(marketsRes);

        const _priceMap = new Map();

        if (marketsRes.response.ok && marketsRes.response.status === 200) {
            marketsRes.data.forEach((market) => {
                _priceMap.set(market.id, {
                    currentPrice: market.current_price,
                    priceChangePercentage24H: market.price_change_percentage_24h,
                });
            });
        }

        setPriceMap(_priceMap);
    }

    useEffect(() => {
        if (!tokenRegistry) {
            return;
        }

        fetchMarkets();
    }, [tokenRegistry]);

    return <CoingeckoContext.Provider value={{ priceMap }}>{children}</CoingeckoContext.Provider>;
}

export function useCoingecko() {
    const { priceMap } = useContext(CoingeckoContext);

    return priceMap;
}
