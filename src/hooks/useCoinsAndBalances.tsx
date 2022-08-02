import { JsonMetadata } from "@metaplex-foundation/js";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import CoinAdapter from "../services/CoinAdapter";
import SolanaAdapter from "../services/SolanaAdapter";
import { fetchGetJSON } from "../utils/fetch";
import useActiveAccount from "./useActiveAccountIndex";
import { useCoingecko } from "./useCoingecko";
import { useConnection } from "./useConnection";
import { useTokenRegistry } from "./useTokenRegistry";
import { useUnlockedAccount } from "./useUnlockedAccount";

export interface Coin {
    tokenStandard?: TokenStandard;
    marketData?: CoinMarketData;
    address: string;
    decimals: number;
    supply: string;
    metadata: CoinMetadata;
}

export interface CoinMarketData {
    currentPrice: number;
    priceChangePercentage24H: number;
}

export interface CoinMetadata {
    description?: string;
    icon?: string;
    symbol: string;
    name: string;
}

export interface CoinAndBalance {
    tokenAccounts: Array<{ address: string; amount: string; uiAmountString?: string }>;
    coin: Coin;
}

export interface ICoinsAndBalancesContext {
    coinsAndBalances: CoinAndBalance[];
    loading: boolean;
}

export const CoinsAndBalancesContext = createContext({} as ICoinsAndBalancesContext);

export default function CoinsAndBalancesProvider({ children }: { children: ReactNode }) {
    const [coinsAndBalances, setCoinsAndBalances] = useState<CoinAndBalance[]>([]);
    const [loading, setLoading] = useState(true);

    const connection = useConnection();
    const [unlockedAccountMeta] = useUnlockedAccount();

    const tokenRegistry = useTokenRegistry();
    const coingeckoPriceMap = useCoingecko();

    async function fetchCoinsAndBalances() {
        setLoading(true);
        const tokenAccounts = await SolanaAdapter.getTokenAccountsByOwner(
            connection,
            new PublicKey(unlockedAccountMeta!.publicKey)
        );

        let _coinsAndBalances = (await Promise.all(
            tokenAccounts.map(async (account): Promise<CoinAndBalance | undefined> => {
                const coin = await CoinAdapter.getCoinForMint(
                    connection,
                    account.mint,
                    tokenRegistry!,
                    coingeckoPriceMap!
                );

                if (!coin) {
                    return undefined;
                }

                return {
                    tokenAccounts: [
                        {
                            address: account.address.toString(),
                            amount: account.tokenAmount.amount,
                            uiAmountString: account.tokenAmount.uiAmountString || undefined,
                        },
                    ],
                    coin,
                };
            })
        ).then((x) => x.filter((y) => y))) as CoinAndBalance[];

        _coinsAndBalances = _coinsAndBalances.reduce<CoinAndBalance[]>((prev, curr, i) => {
            const existingCoinIndex = prev.findIndex((x) => x.coin.address === curr.coin.address);

            if (existingCoinIndex === -1) {
                prev.push(curr);
            } else {
                prev[existingCoinIndex].tokenAccounts.push({
                    ...curr.tokenAccounts[0],
                });
            }

            return prev;
        }, []);

        _coinsAndBalances = _coinsAndBalances.sort((a, b) => (a.coin.marketData ? -1 : 1));

        setCoinsAndBalances(_coinsAndBalances);
        setLoading(false);
    }

    useEffect(() => {
        if (!tokenRegistry || !coingeckoPriceMap || !unlockedAccountMeta) {
            return;
        }

        fetchCoinsAndBalances();
    }, [unlockedAccountMeta, tokenRegistry, coingeckoPriceMap]);

    return (
        <CoinsAndBalancesContext.Provider value={{ coinsAndBalances, loading }}>
            {children}
        </CoinsAndBalancesContext.Provider>
    );
}

export function useCoinsAndBalances() {
    const { coinsAndBalances, loading } = useContext(CoinsAndBalancesContext);
    return [coinsAndBalances, loading] as const;
}
