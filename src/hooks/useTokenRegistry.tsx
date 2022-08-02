import { TokenInfoMap, TokenListProvider } from "@solana/spl-token-registry";
import { ReactNode, createContext, useState, useEffect, useContext } from "react";
import useSelectedCluster from "./useSelectedCluster";

export const TokenRegistryContext = createContext({} as TokenInfoMap | undefined);

export default function TokenRegistryProvider({ children }: { children: ReactNode }) {
    const [selectedCluster] = useSelectedCluster();

    const [tokenRegistryMap, setTokenRegistryMap] = useState<TokenInfoMap | undefined>(undefined);

    async function fetchTokenMap() {
        const tokenContainer = await new TokenListProvider().resolve();

        const _tokenRegistryMap = tokenContainer
            .filterByClusterSlug(selectedCluster.slug)
            .getList()
            .reduce((map, item) => {
                map.set(item.address, item);
                return map;
            }, new Map());

        setTokenRegistryMap(_tokenRegistryMap);
    }

    useEffect(() => {
        fetchTokenMap();
    }, [selectedCluster]);

    return <TokenRegistryContext.Provider value={tokenRegistryMap}>{children}</TokenRegistryContext.Provider>;
}

export function useTokenRegistry() {
    return useContext(TokenRegistryContext);
}
