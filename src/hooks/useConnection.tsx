import { Connection } from "@solana/web3.js";
import { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import useSelectedCluster from "./useSelectedCluster";

interface IConnectionContext {
    connection: Connection;
}

export const ConnectionContext = createContext({} as IConnectionContext);

export default function ConnectionProvider({ children }: { children: ReactNode }) {
    const [selectedCluster] = useSelectedCluster();

    const connection = useMemo(
        () =>
            new Connection(selectedCluster.endpoint, {
                commitment: "processed",
            }),
        [selectedCluster]
    );

    return <ConnectionContext.Provider value={{ connection }}>{children}</ConnectionContext.Provider>;
}

export function useConnection() {
    const { connection } = useContext(ConnectionContext);

    return connection;
}
