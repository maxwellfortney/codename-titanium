import { JsonMetadata } from "@metaplex-foundation/js";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { TokenInfoMap } from "@solana/spl-token-registry";
import { Connection, PublicKey } from "@solana/web3.js";
import { Coin, CoinMarketData } from "../hooks/useCoinsAndBalances";
import { fetchGetJSON } from "../utils/fetch";
import SolanaAdapter from "./SolanaAdapter";

export default class CoinAdapter {
    static async getCoinForMint(
        connection: Connection,
        mint: PublicKey,
        tokenRegistry: TokenInfoMap,
        coingeckoPriceMap: Map<string, CoinMarketData>
    ) {
        const tokenSupply = await connection.getTokenSupply(mint);

        const coin = {
            address: mint.toString(),
            decimals: tokenSupply.value.decimals,
            supply: tokenSupply.value.amount,
        } as Coin;

        let name = undefined;
        let symbol = undefined;
        let image = undefined;
        let coingeckoId = undefined;

        const metadata = await SolanaAdapter.getParsedMetadataForMint(connection, mint);

        // Has a metadata tokenStandard
        if (metadata && metadata.tokenStandard !== null) {
            // Remove any tokens that are now fungible
            if (metadata.tokenStandard !== TokenStandard.Fungible) {
                return undefined;
            }
        }

        if (!metadata || metadata.tokenStandard === null) {
            // filter out nfts
            if (Number(tokenSupply.value.amount) === 1 && tokenSupply.value.decimals === 0) {
                return undefined;
            }

            // filter out semi-fungibles
            if (Number(tokenSupply.value.amount) > 1 && tokenSupply.value.decimals === 0) {
                return undefined;
            }
        }

        if (metadata && metadata.data) {
            name = metadata.data.name;
            symbol = metadata.data.symbol;

            if (metadata.data.uri) {
                let offChainMeta = undefined;
                try {
                    offChainMeta = (await fetchGetJSON(metadata.data.uri, undefined, 200)) as JsonMetadata;

                    name = name ?? offChainMeta.name;
                    symbol = symbol ?? offChainMeta.symbol;
                    image = image ?? offChainMeta.image;
                } catch {
                    console.log(`Failed to fetch ${metadata.data.uri}`);
                }
            }
        }

        console.log({ tokenRegistry });
        const tokenRegInfo = tokenRegistry.get(mint.toString());

        if (tokenRegInfo) {
            name = name ?? tokenRegInfo.name;
            symbol = symbol ?? tokenRegInfo.symbol;
            image = image ?? tokenRegInfo.logoURI;
            coingeckoId = tokenRegInfo.extensions?.coingeckoId;
        }

        if (coingeckoId) {
            coin.marketData = coingeckoPriceMap.get(coingeckoId);
        }

        // fallback
        coin.metadata = {
            name: name ?? "Unknown Coin",
            symbol: symbol ?? mint.toString().slice(0, 3),
            icon: image,
        };

        return coin;
    }
}
